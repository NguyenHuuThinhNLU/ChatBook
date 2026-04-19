const tradeMembers = [
  {
    name: 'Bao',
    role: 'Chu bai dang',
    status: 'San sang phan hoi',
    focus: 'Muon doi sach ky nang',
  },
  {
    name: 'An',
    role: 'Nguoi quan tam',
    status: 'Da gui de nghi',
    focus: 'Muon mua neu khong doi duoc',
  },
  {
    name: 'Ha',
    role: 'Ban chung',
    status: 'Ho tro xac nhan',
    focus: 'Kiem tra lich hen gap',
  },
]

const messages = [
  {
    author: 'Bao',
    text: 'Minh dang co cuon "Tuoi Tre Dang Gia Bao Nhieu", sach con rat dep. Ban uu tien doi hay mua lai?',
    time: '20:15',
    incoming: true,
  },
  {
    author: 'An',
    text: 'Minh uu tien doi bang "Nha Gia Kim". Neu can minh co the bu them tien de chot nhanh.',
    time: '20:17',
    incoming: false,
  },
  {
    author: 'Bao',
    text: 'Hop ly. Ban gui giup minh tinh trang sach va anh bia, neu on minh se giu lich gap cuoi tuan.',
    time: '20:19',
    incoming: true,
  },
  {
    author: 'An',
    text: 'Minh vua gui anh roi. Sach khong rach, co ghi chu it o vai trang dau.',
    time: '20:21',
    incoming: false,
  },
]

const conversationList = [
  {
    title: 'Tuoi Tre Dang Gia Bao Nhieu',
    subtitle: 'Bao dang cho xac nhan tinh trang sach',
    unread: 2,
    active: true,
  },
  {
    title: 'Clean Code',
    subtitle: 'Thoa thuan gia tien',
    unread: 0,
    active: false,
  },
  {
    title: 'Sherlock Holmes',
    subtitle: 'Hen gap tai quan cafe',
    unread: 1,
    active: false,
  },
  {
    title: 'Nha Gia Kim',
    subtitle: 'Da chot doi vao thu 7',
    unread: 0,
    active: false,
  },
]

function Scene() {
  return (
    <div className="page page-scene">
      <section className="scene-hero surface-card">
        <div>
          <span className="eyebrow">Exchange Chat</span>
          <h1>Thương lượng nhanh, rõ ràng và để rõ ràng giao dịch hơn.</h1>
          <p>
            Một khung chat gọn gàng để theo dõi tiến độ trao đổi sách, 
            thông tin bài đăng và cá móc cán xác nhận trước khi gặp mặt
          </p>
        </div>

        <div className="scene-hero-metrics">
          <article className="stat-card">
            <strong>04</strong>
            <span>Cuộc trò chuyện đang mở</span>
          </article>
          <article className="stat-card">
            <strong>02</strong>
            <span>Để nghị cần phản hồi</span>
          </article>
        </div>
      </section>

      <section className="scene-layout">
        <aside className="scene-sidebar surface-card">
          <div className="section-heading compact">
            <div>
              <span className="section-kicker">Họp thư</span>
              <h2>Cuộc trò chuyện</h2>
            </div>
          </div>

          <div className="conversation-list">
            {conversationList.map((item) => (
              <button
                className={item.active ? 'conversation-item active' : 'conversation-item'}
                key={item.title}
                type="button"
              >
                <div className="avatar">{item.title.slice(0, 1)}</div>
                <div className="conversation-copy">
                  <div className="conversation-top">
                    <strong>{item.title}</strong>
                    {item.unread > 0 ? <span className="unread-badge">{item.unread}</span> : null}
                  </div>
                  <p>{item.subtitle}</p>
                </div>
              </button>
            ))}
          </div>
        </aside>

        <main className="scene-main surface-card">
          <div className="chat-header">
            <div>
              <span className="section-kicker">Phiên trao đổi sách</span>
              <h2>Tuổi trẻ đáng giá bao nhiêu</h2>
              <p>Dang thuong luong giua Bao va An, uu tien chot lich gap cuoi tuan.</p>
            </div>

            <div className="tag-row">
              <span className="pill">Dang trao doi</span>
              <span className="pill muted">Cap nhat 2 phut truoc</span>
            </div>
          </div>

          <div className="trade-summary">
            <div>
              <span className="section-kicker">Tình trạng sách</span>
              <strong>Con moi 90%, khong rach</strong>
            </div>
            <div>
              <span className="section-kicker">Nhu cầu</span>
              <strong>Uu tien sach ky nang va kinh doanh</strong>
            </div>
            <div>
              <span className="section-kicker">Bước tiếp theo</span>
              <strong>Xac nhan anh va hen diem giao</strong>
            </div>
          </div>

          <div className="message-list">
            {messages.map((item, index) => (
              <div
                className={`message-item ${item.incoming ? 'incoming' : 'outgoing'}`}
                key={`${item.author}-${index}`}
              >
                <div className="message-meta">
                  <strong>{item.author}</strong>
                  <span>{item.time}</span>
                </div>
                <p>{item.text}</p>
              </div>
            ))}
          </div>

          <div className="composer">
            <input
              type="text"
              placeholder="Nhap noi dung thuong luong, hoi them tinh trang sach hoac de xuat lich hen..."
            />
            <button className="button button-primary" type="button">
              Gui de nghi
            </button>
          </div>
        </main>

        <aside className="scene-panel surface-card">
          <div className="section-heading compact">
            <div>
              <span className="section-kicker">Tổng quan</span>
              <h2>Người tham gia</h2>
            </div>
          </div>

          <div className="member-list">
            {tradeMembers.map((member) => (
              <div className="member-item" key={member.name}>
                <div className="avatar">{member.name.slice(0, 1)}</div>
                <div>
                  <strong>{member.name}</strong>
                  <p>{member.role}</p>
                  <div className="tag-row">
                    <span className="pill muted">{member.status}</span>
                    <span className="pill muted">{member.focus}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="note-card">
            <span className="section-kicker">Checklist giao dich</span>
            <p>Hen gap o noi cong cong, kiem tra sach tai cho va xac nhan lai cach thanh toan neu co bu tien.</p>
          </div>

          <div className="note-card">
            <span className="section-kicker">Mốc cần làm</span>
            <p>Gửi thêm ảnh bìa sau, chốt đại điểm vào tối thứ 6 và đánh dấu giao dịch hoàn tát sau khi đổi sách.</p>
          </div>
        </aside>
      </section>
    </div>
  )
}

export default Scene
