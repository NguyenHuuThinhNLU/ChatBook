const highlights = [
  { label: 'Sach dang duoc dang', value: '248' },
  { label: 'Luot trao doi thanh cong', value: '1,032' },
  { label: 'Nguoi dung dang online', value: '89' },
]

const bookPosts = [
  {
    title: 'Nha Gia Kim',
    owner: 'Linh Tran',
    condition: 'Con moi 90%',
    wish: 'Doi sach self-help hoac ban lai',
    genre: 'Tieu thuyet',
    price: '75.000d',
  },
  {
    title: 'Dac Nhan Tam',
    owner: 'Hoang Nam',
    condition: 'Sach dep, co boc bia',
    wish: 'Muon doi sach ky nang mem',
    genre: 'Ky nang song',
    price: '68.000d',
  },
  {
    title: 'Clean Code',
    owner: 'Minh Thu',
    condition: 'Co gach but chi o vai trang',
    wish: 'Doi sach lap trinh JavaScript',
    genre: 'Cong nghe',
    price: '180.000d',
  },
]

const exchangeRequests = [
  'Can tim truyen trinh tham cua Higashino de trao doi.',
  'Nhan doi sach van hoc Viet Nam tinh trang con tot.',
  'Dang tim combo sach hoc React cho nguoi moi.',
]

function Home() {
  return (
    <div className="page page-home">
      <section className="hero-card">
        <div className="hero-copy">
          <span className="eyebrow">Book Exchange Community</span>
          <h1>Noi dang sach, tim sach muon doi va ket noi voi nguoi cung gu.</h1>
          <p>
            Trang chu nay phu hop cho mot mang xa hoi ban sach: co feed bai dang,
            thong tin sach dang san co, nhu cau trao doi va khu vuc de nguoi dung
            dang bai moi nhanh.
          </p>
          <div className="hero-actions">
            <button className="button button-primary">Dang sach muon trao doi</button>
            <button className="button button-secondary">Kham pha bai dang</button>
          </div>
        </div>

        <div className="hero-panel">
          <div className="panel-badge">Hoat dong hom nay</div>
          <div className="stats-grid">
            {highlights.map((item) => (
              <article className="stat-card" key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="content-grid">
        <article className="surface-card">
          <div className="section-heading">
            <div>
              <span className="section-kicker">Bang tin sach</span>
              <h2>Bai dang noi bat</h2>
            </div>
            <button className="text-link">Xem feed day du</button>
          </div>

          <div className="book-feed">
            {bookPosts.map((item) => (
              <article className="book-post" key={item.title}>
                <div className="book-cover">
                  <span>{item.genre}</span>
                </div>
                <div className="book-post-copy">
                  <div className="conversation-top">
                    <strong>{item.title}</strong>
                    <span>{item.price}</span>
                  </div>
                  <p className="book-owner">Dang boi {item.owner}</p>
                  <p>{item.condition}</p>
                  <p>{item.wish}</p>
                  <div className="tag-row">
                    <span className="pill">{item.genre}</span>
                    <span className="pill muted">Uu tien doi truc tiep</span>
                  </div>
                </div>
                <button className="button button-secondary">Xem chi tiet</button>
              </article>
            ))}
          </div>
        </article>

        <article className="surface-card">
          <div className="section-heading">
            <div>
              <span className="section-kicker">Nhu cau trao doi</span>
              <h2>Nguoi dung dang tim gi</h2>
            </div>
          </div>

          <div className="schedule-list">
            {exchangeRequests.map((item) => (
              <div className="schedule-item" key={item}>
                <span className="dot" />
                <p>{item}</p>
              </div>
            ))}
          </div>

          <div className="note-card post-creator">
            <span className="section-kicker">Dang bai nhanh</span>
            <h3>Ban co cuon sach nao muon trao doi?</h3>
            <p>
              Them ten sach, tinh trang, gia mong muon hoac loai sach ban can.
              Phan nay co the doi thanh form dang bai that o buoc tiep theo.
            </p>
            <button className="button button-primary">Tao bai dang moi</button>
          </div>
        </article>
      </section>
    </div>
  )
}

export default Home
