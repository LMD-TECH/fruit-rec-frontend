import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { LoginForm } from '../components/login-form'
import { useCustomQuery } from '@/context/querycontext'
import { createCookies } from '@/services/cookies.action'
import { toast } from 'sonner'
import { vi, describe, it, expect, beforeEach } from 'vitest'

// Mock Next.js router
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        replace: vi.fn(),
        push: vi.fn(),
    }),
}))


vi.mock('@/context/querycontext')
vi.mock('@/services/cookies.action')
vi.mock('sonner')

describe('LoginForm', () => {
    const mockOnMutate = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks();
        (useCustomQuery as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ onMutate: mockOnMutate })
    })

    it('renders login form correctly', () => {
        render(<LoginForm />)

        expect(screen.getByTestId('email')).toBeDefined()
        expect(screen.getByTestId('password')).toBeDefined()
        expect(screen.getByText('Soumettre')).toBeDefined()
        expect(screen.getByText('Mot de passe oublié ?')).toBeDefined()
        expect(screen.getByText(/Tu n'es pas encore inscrit ?/)).toBeDefined()
    })

    it('handles successful login', async () => {
        const successResponse = {
            status: true,
            message: 'Connexion réussie',
            token: 'fake-token',
            status_code: 200
        }

        mockOnMutate.mockResolvedValueOnce(successResponse)

        render(<LoginForm />)

        fireEvent.change(screen.getByTestId('email'), {
            target: { value: 'test@codeangel.pro' }
        })
        fireEvent.change(screen.getByTestId('password'), {
            target: { value: 'test' }
        })

        fireEvent.click(screen.getByText('Soumettre'))

        await waitFor(() => {
            expect(mockOnMutate).toHaveBeenCalledWith({
                body: {
                    email: 'test@codeangel.pro',
                    mot_de_passe: 'test'
                },
                endpoint: '/api/auth/login'
            })
            expect(createCookies).toHaveBeenCalledWith('auth_token', 'fake-token')
            expect(toast).toHaveBeenCalledWith('Connexion réussie')
        })
    })

    it('handles unverified email error', async () => {
        const errorResponse = {
            status: false,
            message: 'Email non vérifié',
            status_code: 403,
            error: 'Veuillez vérifier votre email'
        }

        mockOnMutate.mockResolvedValueOnce(errorResponse)

        render(<LoginForm />)

        fireEvent.change(screen.getByTestId('email'), {
            target: { value: 'unverified@codeangel.pro' }
        })
        fireEvent.change(screen.getByTestId('password'), {
            target: { value: 'password123' }
        })

        fireEvent.click(screen.getByText('Soumettre'))

        await waitFor(() => {
            expect(toast).toHaveBeenCalledWith('Email non vérifié', {
                description: 'Veuillez vérifier votre email',
                style: expect.any(Object),
                action: expect.any(Object)
            })
        })
    })

    it('handles generic error', async () => {
        const errorResponse = {
            status: false,
            message: 'Erreur de connexion',
            status_code: 400,
            error: 'Identifiants invalides'
        }

        mockOnMutate.mockResolvedValueOnce(errorResponse)

        render(<LoginForm />)

        fireEvent.change(screen.getByTestId('email'), {
            target: { value: 'error@codeangel.pro' }
        })
        fireEvent.change(screen.getByTestId('password'), {
            target: { value: 'wrongpassword' }
        })

        fireEvent.click(screen.getByText('Soumettre'))

        await waitFor(() => {
            expect(toast).toHaveBeenCalledWith('Erreur de connexion', {
                description: 'Identifiants invalides'
            })
        })
    })

    it('shows loading state during form submission', async () => {
        mockOnMutate.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

        render(<LoginForm />)

        fireEvent.change(screen.getByTestId('email'), {
            target: { value: 'test@codeangel.pro' }
        })
        fireEvent.change(screen.getByTestId('password'), {
            target: { value: 'password123' }
        })

        fireEvent.click(screen.getByText('Soumettre'))

        expect(screen.getByText('Soumission...')).toBeInTheDocument()
        expect(screen.getByRole('button')).toBeDisabled()
    })
}) 