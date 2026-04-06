import { useState } from 'react'
import { login } from '../services/authenticationService'
import { getMyInfo, register } from '../services/userService'

const initialLoginForm = {
  username: '',
  password: '',
}

const initialRegisterForm = {
  username: '',
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

    onLoginSuccess?.(user)
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

    if (registerForm.password !== registerForm.confirmPassword) {
      setErrorMessage('Mat khau nhap lai khong khop.')
      return
    }

    setIsSubmitting(true)

    try {
      await register({
        username: registerForm.username.trim(),
        password: registerForm.password,
        firstName: registerForm.firstName.trim(),
        lastName: registerForm.lastName.trim(),
        dob: registerForm.dob,
        city: registerForm.city.trim(),
      })

      setSuccessMessage('Dang ky thanh cong. Dang tien hanh dang nhap...')
      await completeLogin(registerForm.username.trim(), registerForm.password)
    } catch (error) {
      setErrorMessage(
        getApiMessage(error, 'Dang ky that bai. Vui long kiem tra lai du lieu.'),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="page page-login">
      <section className="login-layout">
        <article className="login-intro surface-card">
          <span className="eyebrow">Chao mung den voi BookLoop</span>
          <h1>
            {isRegisterMode
              ? 'Tao tai khoan de dang sach va bat dau trao doi voi cong dong.'
              : 'Dang nhap de dang sach, ket ban va trao doi sach de dang hon.'}
          </h1>
          <p>
            {isRegisterMode
              ? 'Trang dang ky nay da match truc tiep voi payload ma backend cua ban dang can: username, password, firstName, lastName, dob, city.'
              : 'Trang dang nhap giup nguoi dung tro lai nhanh, xem bai dang sach va tiep tuc cuoc trao doi dang mo.'}
          </p>

          <div className="feature-list">
            <div className="feature-item">
              <strong>Dang bai trong vai giay</strong>
              <span>Dang sach cu, mo ta tinh trang va dat nhu cau trao doi ngay.</span>
            </div>
            <div className="feature-item">
              <strong>Ho so nguoi doc ro rang</strong>
              <span>Them ten, ngay sinh va thanh pho de de xep giao dich hon.</span>
            </div>
            <div className="feature-item">
              <strong>Trao doi an toan hon</strong>
              <span>Chat truc tiep truoc khi gap mat hoac chuyen khoan mua sach.</span>
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
              Dang nhap
            </button>
            <button
              type="button"
              className={authMode === 'register' ? 'tab active' : 'tab'}
              onClick={() => handleModeChange('register')}
            >
              Dang ky
            </button>
          </div>

          <div className="section-heading compact">
            <div>
              <span className="section-kicker">Tai khoan nguoi dung</span>
              <h2>
                {isRegisterMode
                  ? 'Tao tai khoan moi'
                  : 'Dang nhap vao cong dong sach'}
              </h2>
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

              <label className="field">
                <span>Mat khau</span>
                <input
                  name="password"
                  type="password"
                  placeholder="Toi thieu 6 ky tu"
                  value={registerForm.password}
                  onChange={handleRegisterChange}
                />
              </label>

              <label className="field">
                <span>Nhap lai mat khau</span>
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="Nhap lai mat khau"
                  value={registerForm.confirmPassword}
                  onChange={handleRegisterChange}
                />
              </label>

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
                <span>Ten dang nhap</span>
                <input
                  name="username"
                  type="text"
                  placeholder="Nhap ten dang nhap"
                  value={loginForm.username}
                  onChange={handleLoginChange}
                />
              </label>

              <label className="field">
                <span>Mat khau</span>
                <input
                  name="password"
                  type="password"
                  placeholder="Nhap mat khau cua ban"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                />
              </label>

              <div className="form-row">
                <label className="checkbox-field">
                  <input type="checkbox" />
                  <span>Giu dang nhap tren thiet bi nay</span>
                </label>

                <button type="button" className="text-link">
                  Quen mat khau
                </button>
              </div>

              {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
              {successMessage ? <p className="form-success">{successMessage}</p> : null}

              <button
                type="submit"
                className="button button-primary wide"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Dang dang nhap...' : 'Dang nhap ngay'}
              </button>

              <button
                type="button"
                className="button button-secondary wide"
                disabled={isSubmitting}
              >
                Tiep tuc voi Google
              </button>
            </form>
          )}

          <p className="form-footer">
            {isRegisterMode ? (
              <>
                Da co tai khoan?{' '}
                <button
                  type="button"
                  className="text-link inline-link"
                  onClick={() => handleModeChange('login')}
                >
                  Dang nhap ngay
                </button>
              </>
            ) : (
              <>
                Chua co tai khoan?{' '}
                <button
                  type="button"
                  className="text-link inline-link"
                  onClick={() => handleModeChange('register')}
                >
                  Tao tai khoan de bat dau trao doi
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
