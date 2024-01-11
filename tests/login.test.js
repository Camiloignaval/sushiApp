import { render, screen } from '@testing-library/react'
import LoginPage from '../pages/login'
import jest from 'jest'
import { Provider } from 'react-redux'
import { store } from '../store'

describe('Test in Login Page', () => {

    // URL.createObjectURL = jest.fn()
    test('should render component', () => {
        render(
            <Provider store={store}>
                <LoginPage />
            </Provider>
        )
        const loginText = screen.getAllByText('Iniciar sesión')
        expect(loginText.length).toBeGreaterThan(0)

    })
    test('should can write in inputs user and pass', () => {
        render(
            <Provider store={store}>
                <LoginPage />
            </Provider>
        )

        const inputUser = screen.getByLabelText('userName')
        const inputPass = screen.getByLabelText('password')

        console.log({ inputUser, inputPass });

    })
})