import { useState } from 'react'
import { login } from '../services/authenticationService'
import { getMyInfo, register } from '../services/userService'

const initialLoginForm = {
  username: '',
  password: '',
}

const initialRegisterForm = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
  dob: '',
  city: '',
}

const getApiMessage = (error, fallbackMessage) => {
  if (error?.response?.data?.message) {
    return error.response.data.message
  }

  return error?.message || fallbackMessage
}

function Login({ onLoginSuccess }) {
  const [authMode, setAuthMode] = useState('login')
  const [loginForm, setLoginForm] = useState(initialLoginForm)
  const [registerForm, setRegisterForm] = useState(initialRegisterForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const isRegisterMode = authMode === 'register'

  const resetMessages = () => {
    setErrorMessage('')
    setSuccessMessage('')
  }

  const handleModeChange = (mode) => {
    setAuthMode(mode)
    resetMessages()
  }

  const handleLoginChange = (event) => {
    const { name, value } = event.target

    setLoginForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleRegisterChange = (event) => {
    const { name, value } = event.target

    setRegisterForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const completeLogin = async (username, password) => {
    await login(username, password)
    const response = await getMyInfo()
    const user = response.data?.result

    if (!user) {
      throw new Error('Khong lay duoc thong tin nguoi dung.')
    }

    onLoginSuccess?.({
      ...user,
      username,
    })
  }

  const handleLoginSubmit = async (event) => {
    event.preventDefault()
    resetMessages()
    setIsSubmitting(true)

    try {
      await completeLogin(loginForm.username.trim(), loginForm.password)
    } catch (error) {
      setErrorMessage(
        getApiMessage(error, 'Dang nhap that bai. Vui long kiem tra lai thong tin.'),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRegisterSubmit = async (event) => {
    event.preventDefault()
    resetMessages()

    if (!registerForm.username.trim()) {
      setErrorMessage('Vui lòng đăng nhập.')
      return
    }

    if (!registerForm.email.trim()) {
      setErrorMessage('Vui lòng nhập Email.')
      return
    }

    if (!registerForm.email.includes('@')) {
      setErrorMessage('Email không hợp lệ.')
      return
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setErrorMessage('Mật khẩu nhập lại không khớp.')
      return
    }

    setIsSubmitting(true)

    try {
      await register({
        username: registerForm.username.trim(),
        email: registerForm.email.trim(),
        password: registerForm.password,
        firstName: registerForm.firstName.trim(),
        lastName: registerForm.lastName.trim(),
        dob: registerForm.dob,
        city: registerForm.city.trim(),
      })

      setSuccessMessage('Đăng ký thành công. Đang tiến hành đăng nhập...')
      await completeLogin(registerForm.username.trim(), registerForm.password)
    } catch (error) {
      setErrorMessage(
        getApiMessage(error, 'Đăng ký thất bại. Vui lòng kiểm tra lại dữ liệu.'),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="page page-login">
      <section className="login-layout">
        <article className="login-intro surface-card">
          <div className="login-intro-copy">
            <span className="eyebrow">BookLoop Access</span>
            <h1>
              {isRegisterMode
                ? 'Tạo tài khoản để đăng sách, kết nối và bắt đầu trao đổi.'
                : 'Đăng nhập để tiếp tục quản lý bài đăng và các cuộc trò chuyện của bạn.'}
            </h1>
            <p>
              Trang đang nhập
            </p>
          </div>

          <div className="feature-list">
            <div className="feature-item">
              <div className="avatar">01</div>
              <div>
                <strong>Đăng bài nhanh</strong>
                <span>Mô tả sách, tình trạng và nhu cầu.</span>
              </div>
            </div>
            <div className="feature-item">
              <div className="avatar">02</div>
              <div>
                <strong>Quản lý profile</strong>
                <span>Xem thông tin tài khoản menu người dùng.</span>
              </div>
            </div>
            <div className="feature-item">
              <div className="avatar">03</div>
              <div>
                <strong>Chuyển sang Chat </strong>
                <span>Theo dõi thương lượng và tiến độ giao dịch.</span>Theo doi thuong luong va tien do giao dich khong bi roi mach.
              </div>
            </div>
          </div>
        </article>

        <article className="login-form-card">
          <div className="auth-switcher">
            <button
              type="button"
              className={authMode === 'login' ? 'tab active' : 'tab'}
              onClick={() => handleModeChange('login')}
            >
              Đăng nhập
            </button>
            <button
              type="button"
              className={authMode === 'register' ? 'tab active' : 'tab'}
              onClick={() => handleModeChange('register')}
            >
              Đăng ký
            </button>
          </div>

          <div className="section-heading compact">
            <div>
              <span className="section-kicker">Tài khoản</span>
              <h2>{isRegisterMode ? 'Tao tai khoan moi' : 'Truy cap BookLoop'}</h2>
            </div>
          </div>

          {isRegisterMode ? (
            <form className="form-grid" onSubmit={handleRegisterSubmit}>
              <div className="field-grid">
                <label className="field">
                  <span>Ho</span>
                  <input
                    name="firstName"
                    type="text"
                    placeholder="Nguyen"
                    value={registerForm.firstName}
                    onChange={handleRegisterChange}
                  />
                </label>

                <label className="field">
                  <span>Ten</span>
                  <input
                    name="lastName"
                    type="text"
                    placeholder="An"
                    value={registerForm.lastName}
                    onChange={handleRegisterChange}
                  />
                </label>
              </div>

              <label className="field">
                <span>Ten dang nhap</span>
                <input
                  name="username"
                  type="text"
                  placeholder="booklover01"
                  value={registerForm.username}
                  onChange={handleRegisterChange}
                />
              </label>

              <label className="field">
                <span>Email</span>
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={registerForm.email}
                  onChange={handleRegisterChange}
                />
              </label>

              <div className="field-grid">
                <label className="field">
                  <span>Ngay sinh</span>
                  <input
                    name="dob"
                    type="date"
                    value={registerForm.dob}
                    onChange={handleRegisterChange}
                  />
                </label>

                <label className="field">
                  <span>Thanh pho</span>
                  <input
                    name="city"
                    type="text"
                    placeholder="Da Nang"
                    value={registerForm.city}
                    onChange={handleRegisterChange}
                  />
                </label>
              </div>

              <div className="field-grid">
                <label className="field">
                  <span>Mật Khẩu</span>
                  <input
                    name="password"
                    type="password"
                    placeholder="Toi thieu 6 ky tu"
                    value={registerForm.password}
                    onChange={handleRegisterChange}
                  />
                </label>

                <label className="field">
                  <span>Nhập lại mật khẩu</span>
                  <input
                    name="confirmPassword"
                    type="password"
                    placeholder="Nhap lai mat khau"
                    value={registerForm.confirmPassword}
                    onChange={handleRegisterChange}
                  />
                </label>
              </div>

              {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
              {successMessage ? <p className="form-success">{successMessage}</p> : null}

              <button
                type="submit"
                className="button button-primary wide"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Dang tao tai khoan...' : 'Tao tai khoan'}
              </button>
            </form>
          ) : (
            <form className="form-grid" onSubmit={handleLoginSubmit}>
              <label className="field">
                <span>Tên Đăng Nhập</span>
                <input
                  name="username"
                  type="text"
                  placeholder="Nhap ten dang nhap"
                  value={loginForm.username}
                  onChange={handleLoginChange}
                />
              </label>

              <label className="field">
                <span>Mật Khẩu</span>
                <input
                  name="password"
                  type="password"
                  placeholder="Nhap mat khau cua ban"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                />
              </label>

              {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
              {successMessage ? <p className="form-success">{successMessage}</p> : null}

              <button
                type="submit"
                className="button button-primary wide"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Dang dang nhap...' : 'Dang nhap'}
              </button>
            </form>
          )}

          <p className="form-footer">
            {isRegisterMode ? (
              <>
                Đã có tài khoản?{' '}
                <button
                  type="button"
                  className="text-link inline-link"
                  onClick={() => handleModeChange('login')}
                >
                  Đăng nhập ngay
                </button>
              </>
            ) : (
              <>
                Chưa có tài khoản?{' '}
                <button
                  type="button"
                  className="text-link inline-link"
                  onClick={() => handleModeChange('register')}
                >
                  Tạo tài khoản
                </button>
              </>
            )}
          </p>
        </article>
      </section>
    </div>
  )
}

export default Login
