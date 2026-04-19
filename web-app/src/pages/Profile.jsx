import { useEffect, useMemo, useState } from 'react'
import { getMyInfo } from '../services/userService'

const formatDate = (value) => {
  if (!value) {
    return 'Chua cap nhat'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Chua cap nhat'
  }

  return date.toLocaleDateString('vi-VN')
}

function Profile() {
  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let cancelled = false

    const loadProfile = async () => {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const response = await getMyInfo()

        if (cancelled) return

        setProfile(response?.data?.result ?? null)
      } catch (error) {
        if (cancelled) return

        setErrorMessage(
          error?.response?.data?.message || error?.message || 'Khong the tai ho so nguoi dung.',
        )
      } finally {
        if (cancelled) return
        setIsLoading(false)
      }
    }

    void loadProfile()

    return () => {
      cancelled = true
    }
  }, [])

  const fullName = [profile?.firstName, profile?.lastName].filter(Boolean).join(' ')
  const profileInitial = fullName ? fullName.slice(0, 1).toUpperCase() : 'U'

  const details = useMemo(
    () => [
      { label: 'Ho', value: profile?.firstName || 'Chua cap nhat' },
      { label: 'Ten', value: profile?.lastName || 'Chua cap nhat' },
      {
        label: 'Ngay sinh',
        value: formatDate(profile?.dob),
      },
      { label: 'Thanh pho', value: profile?.city || 'Chua cap nhat' },
      { label: 'Ma profile', value: profile?.id || 'Chua cap nhat' },
    ],
    [profile],
  )

  return (
    <div className="page page-profile">
      <section className="hero-card">
        <div className="hero-copy">
          <span className="eyebrow">User Profile</span>
          <h1>Thông tin người dùng.</h1>
          <p>
            Trang Thông Tin Người Dùng
          </p>
        </div>

        <div className="hero-panel">
          <article className="profile-summary-card">
            <div className="user-menu-avatar large">{profileInitial}</div>
            <div className="profile-summary-copy">
              <strong>{fullName || 'Nguoi dung BookLoop'}</strong>
              <span>{profile?.city || 'Chua cap nhat thanh pho'}</span>
            </div>
          </article>
        </div>
      </section>

      {errorMessage ? <p className="form-error">{errorMessage}</p> : null}

      {isLoading ? (
        <section className="surface-card status-card">
          <h3>Đang tải thông tin người dùng...</h3>
        </section>
      ) : (
        <section className="surface-card profile-details-card">
          <div className="section-heading">
            <div>
              <span className="section-kicker">Chi tiết</span>
              <h2>Thông tin tài khoản</h2>
            </div>
          </div>

          <div className="profile-field-list">
            {details.map((item) => (
              <div className="profile-field-row" key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default Profile
