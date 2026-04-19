import { useEffect, useMemo, useState } from 'react'
import { getMyposts } from '../services/postService'

const PAGE_SIZE = 10

const exchangeRequests = [
  {
    title: 'Sach ky nang cho nguoi moi di lam',
    detail: 'Can doi sach giao tiep va tu duy he thong, uu tien tinh trang con tot.',
  },
  {
    title: 'Combo React va frontend',
    detail: 'Dang tim sach thuc hanh co vi du thuc te de trao doi cung sach van hoc.',
  },
  {
    title: 'Tieu thuyet trinh tham',
    detail: 'Muon doi cac dau sach Higashino hoac Conan Doyle cho bo suu tap hien tai.',
  },
]

function Home() {
  const [posts, setPosts] = useState([])
  const [pageInfo, setPageInfo] = useState({
    currentPage: 1,
    totalPage: 1,
    pageSize: PAGE_SIZE,
    totalElements: 0,
  })
  const [page, setPage] = useState(1)
  const [isLoadingPosts, setIsLoadingPosts] = useState(false)
  const [postError, setPostError] = useState('')

  const highlights = useMemo(
    () => [
      { label: 'Tổng bài đăng', value: String(pageInfo.totalElements ?? 0) },
      { label: 'Trang hiện tại', value: `${pageInfo.currentPage}/${pageInfo.totalPage}` },
      { label: 'Số bài mỗi trang', value: String(pageInfo.pageSize ?? PAGE_SIZE) },
    ],
    [pageInfo],
  )

  const featuredPosts = useMemo(() => posts.slice(0, 2), [posts])

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setIsLoadingPosts(true)
      setPostError('')

      try {
        const response = await getMyposts(page, PAGE_SIZE)
        const result = response?.data?.result

        if (cancelled) return

        setPosts(Array.isArray(result?.data) ? result.data : [])

        const normalizedTotalPage = Math.max(1, Number(result?.totalPage ?? 1))
        const normalizedCurrentPage = Math.min(
          normalizedTotalPage,
          Math.max(1, Number(result?.currentPage ?? page)),
        )

        setPageInfo({
          currentPage: normalizedCurrentPage,
          totalPage: normalizedTotalPage,
          pageSize: Number(result?.pageSize ?? PAGE_SIZE),
          totalElements: Number(result?.totalElements ?? 0),
        })
      } catch (error) {
        if (cancelled) return
        setPosts([])
        setPostError(
          error?.response?.data?.message || error?.message || 'Không thế bài đăng.',
        )
      } finally {
        if (cancelled) return
        setIsLoadingPosts(false)
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [page])

  const canPrev = pageInfo.currentPage > 1 && !isLoadingPosts
  const canNext = pageInfo.currentPage < pageInfo.totalPage && !isLoadingPosts

  return (
    <div className="page page-home">
      <section className="hero-card hero-card-home">
        <div className="hero-copy">
          <span className="eyebrow">Book Exchange Community</span>
          <h1>Đăng sách cũ, tìm người cùng gu và chốt mốt một cược trao đổi gọn gàng.</h1>
          <p>
            Giao diện trang chủ đượ làm lại để tập trung vào bài đăng của bạn, nhiều
            thông tin hơn trong một màn hình và để scan nhanh trên cả desktop lần mobile.
          </p>
          <div className="hero-actions">
            <button className="button button-primary" type="button">
              Tao bai dang moi
            </button>
            <button className="button button-secondary" type="button" onClick={() => setPage(1)}>
              Tai lai feed
            </button>
          </div>
        </div>

        <div className="hero-panel">
          <div className="panel-badge">Tổng quan hoạt động</div>
          <div className="stats-grid">
            {highlights.map((item) => (
              <article className="stat-card" key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </article>
            ))}
          </div>

          <div className="hero-highlight-list">
            {featuredPosts.length > 0 ? (
              featuredPosts.map((post) => (
                <article className="mini-post-card" key={post.id}>
                  <strong>{post.content}</strong>
                  <span>
                    {post.createdDate
                      ? new Date(post.createdDate).toLocaleString('vi-VN')
                      : 'Chua co ngay tao'}
                  </span>
                </article>
              ))
            ) : (
              <article className="mini-post-card empty">
                <strong>Chưa có bài đăng nổi bật</strong>
                <span>Tạo bài đăng mới đẻ bắt đầu xây dựng hồ sơ trao đổi sách của bạn.</span>
              </article>
            )}
          </div>
        </div>
      </section>

      <section className="content-grid">
        <article className="surface-card">
          <div className="section-heading">
            <div>
              <span className="section-kicker">Feed cá nhân</span>
              <h2>Bài đăng của bạn</h2>
            </div>
            <div className="tag-row">
              <span className="pill muted">{pageInfo.totalElements} Bài đăng</span>
              <span className="pill muted">Trang {pageInfo.currentPage}</span>
            </div>
          </div>

          <div className="book-feed">
            {postError ? <p className="form-error">{postError}</p> : null}
            {isLoadingPosts ? <p>Đang tải bài đăng...</p> : null}
            {!isLoadingPosts && posts.length === 0 && !postError ? <p>Chưa có bài đăng..</p> : null}

            {posts.map((post) => (
              <article className="book-post" key={post.id}>
                <div className="book-cover">
                  <span>POST</span>
                </div>

                <div className="book-post-copy">
                  <div className="conversation-top">
                    <strong className="book-owner">{post.userId}</strong>
                    <span>
                      {post.createdDate
                        ? new Date(post.createdDate).toLocaleString('vi-VN')
                        : 'Không rõ thời gian'}
                    </span>
                  </div>

                  <p>{post.content}</p>

                  <div className="tag-row">
                    <span className="pill">Sẵn sàng trao đổi</span>
                    <span className="pill muted">ID: {post.id}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="hero-actions split-actions">
            <button
              className="button button-secondary"
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={!canPrev}
            >
              Trang trước
            </button>

            <div className="tag-row">
              <span className="pill muted">
                Trang {pageInfo.currentPage}/{pageInfo.totalPage}
              </span>
              <span className="pill muted">{pageInfo.pageSize} Bài / Trang</span>
            </div>

            <button
              className="button button-secondary"
              type="button"
              onClick={() => setPage((current) => Math.min(pageInfo.totalPage, current + 1))}
              disabled={!canNext}
            >
              Trang sau
            </button>
          </div>
        </article>

        <article className="surface-card side-stack">
          <div className="section-heading">
            <div>
              <span className="section-kicker">Nhu cầu nổi bật</span>
              <h2>Người dùng đang tìm gì</h2>
            </div>
          </div>

          <div className="schedule-list">
            {exchangeRequests.map((item) => (
              <div className="schedule-item" key={item.title}>
                <span className="dot" />
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="note-card post-creator">
            <span className="section-kicker">Đăng bài nhanh</span>
            <h3>bạn có cuốn sách nào muốn để lên sàn.</h3>
            <p>
              Mô tả nội dung ngắn gọn, thêm tình trạng sách và mục tiêu trao đổi để
              nguồi khác có thể nhận ra bài đăng của bạn ngay.
            </p>
            <button className="button button-primary" type="button">
              Bắt đầu tạo bài
            </button>
          </div>
        </article>
      </section>
    </div>
  )
}

export default Home
