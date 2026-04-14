import { useState, useEffect, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { signup as apiSignup, pingServer } from '../services/chatApi'

export default function SignupPage() {
  const { login } = useAuth()
  const navigate   = useNavigate()

  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')
  const [error, setError]         = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Wake the server the moment this page loads
  useEffect(() => {
    pingServer()
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)

    try {
      const { token, user } = await apiSignup(email, password)
      login(token, user)
      navigate('/app/chat', { replace: true })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Signup failed'
      setError(
        msg.toLowerCase().includes('fetch') || msg.toLowerCase().includes('network')
          ? 'Could not reach the server. Please try again.'
          : msg.includes('already')
          ? 'An account with this email already exists. Try signing in.'
          : msg
      )
    } finally {
      setIsLoading(false)
    }
  }

  const passwordsMatch = confirm.length > 0 && password === confirm
  const passwordTooShort = password.length > 0 && password.length < 6

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src="/logo-dark.svg" alt="Product Path" className="h-12" />
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <h1 className="text-xl font-semibold text-zinc-100 mb-1">Create your account</h1>
          <p className="text-sm text-zinc-500 mb-6">Start building products with confidence</p>

          {/* Error */}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-950/60 border border-red-900 text-sm text-red-400 flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 flex-shrink-0 mt-0.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
                disabled={isLoading}
                className="w-full px-3 py-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors disabled:opacity-50"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className={`w-full px-3 py-2.5 rounded-lg bg-zinc-800 border text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 transition-colors disabled:opacity-50 ${
                  passwordTooShort
                    ? 'border-red-700 focus:border-red-500 focus:ring-red-500'
                    : 'border-zinc-700 focus:border-indigo-500 focus:ring-indigo-500'
                }`}
                placeholder="Min. 6 characters"
              />
              {passwordTooShort && (
                <p className="mt-1 text-[11px] text-red-400">At least 6 characters required</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                Confirm password
              </label>
              <input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                disabled={isLoading}
                className={`w-full px-3 py-2.5 rounded-lg bg-zinc-800 border text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 transition-colors disabled:opacity-50 ${
                  confirm.length > 0 && !passwordsMatch
                    ? 'border-red-700 focus:border-red-500 focus:ring-red-500'
                    : passwordsMatch
                    ? 'border-teal-600 focus:border-teal-500 focus:ring-teal-500'
                    : 'border-zinc-700 focus:border-indigo-500 focus:ring-indigo-500'
                }`}
                placeholder="••••••••"
              />
              {confirm.length > 0 && !passwordsMatch && (
                <p className="mt-1 text-[11px] text-red-400">Passwords do not match</p>
              )}
              {passwordsMatch && (
                <p className="mt-1 text-[11px] text-teal-400">Passwords match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !email || !passwordsMatch || passwordTooShort}
              className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Creating account…
                </>
              ) : 'Create account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-zinc-500 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
