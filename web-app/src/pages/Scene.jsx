const tradeMembers = [
  { name: 'Bao', role: 'Chu bai dang', status: 'Phan hoi trong 5 phut' },
  { name: 'Ban', role: 'Nguoi muon doi', status: 'Dang thuong luong' },
  { name: 'Ha', role: 'Quan tri vien', status: 'Ho tro bao cao' },
]

const messages = [
  {
    author: 'Bao',
    text: 'Minh dang co cuon "Tuoi Tre Dang Gia Bao Nhieu" ban muon doi hay mua lai?',
    time: '20:15',
    incoming: true,
  },
  {
    author: 'Ban',
    text: 'Minh muon doi bang "Nha Gia Kim", sach con moi. Neu ban khong doi thi minh co the mua.',
    time: '20:17',
    incoming: false,
  },
  {
    author: 'Bao',
    text: 'Ban gui them anh bia va tinh trang sach giup minh, neu on minh de lai cho ban.',
    time: '20:18',
    incoming: true,
  },
]

function Scene() {
  return (
    <div className="page page-scene">
      <section className="scene-layout">
        <aside className="scene-sidebar surface-card">
          <div className="section-heading compact">
            <div>
              <span className="section-kicker">Hop thu trao doi</span>
              <h2>Cuoc tro chuyen gan day</h2>
            </div>
          </div>

          <div className="channel-list">
            <button className="channel-item active">Tuoi Tre Dang Gia Bao Nhieu</button>
            <button className="channel-item">Clean Code - ban lai</button>
            <button className="channel-item">Sherlock Holmes - doi bo truyen</button>
            <button className="channel-item">Nha Gia Kim - da hen gap</button>
          </div>
        </aside>

        <main className="scene-main surface-card">
          <div className="chat-header">
            <div>
              <span className="section-kicker">Phien trao doi sach</span>
              <h1>Tuoi Tre Dang Gia Bao Nhieu</h1>
            </div>
            <button className="button button-secondary">Danh dau da chot</button>
          </div>

          <div className="trade-summary">
            <div>
              <span className="section-kicker">Chu bai dang</span>
              <strong>Bao Nguyen</strong>
            </div>
            <div>
              <span className="section-kicker">Tinh trang sach</span>
              <strong>Sach dep, khong rach</strong>
            </div>
            <div>
              <span className="section-kicker">Nhu cau</span>
              <strong>Uu tien doi sach ky nang</strong>
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
            <input type="text" placeholder="Nhap noi dung thuong luong hoac hoi them ve sach..." />
            <button className="button button-primary">Gui de nghi</button>
          </div>
        </main>

        <aside className="scene-panel surface-card">
          <div className="section-heading compact">
            <div>
              <span className="section-kicker">Thong tin bai dang</span>
              <h2>Nguoi tham gia</h2>
            </div>
          </div>

          <div className="member-list">
            {tradeMembers.map((member) => (
              <div className="member-item" key={member.name}>
                <div className="avatar">{member.name.slice(0, 1)}</div>
                <div>
                  <strong>{member.name}</strong>
                  <p>
                    {member.role} - {member.status}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="note-card">
            <span className="section-kicker">Luu y giao dich</span>
            <p>
              Hen gap o noi cong cong, kiem tra sach truoc khi doi va xac nhan lai
              thong tin neu co chuyen khoan.
            </p>
          </div>
        </aside>
      </section>
    </div>
  )
}

export default Scene
