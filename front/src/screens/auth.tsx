import { AuthBanner } from "../components/AuthBanner"
import { AuthCredentials } from "../components/AuthCredentials"

export function Auth() {
    return (
        <div className="auth-container">
            <div className="auth-banner-side">
                <AuthBanner />
            </div>

            <div className="auth-form-side">
                <AuthCredentials />
            </div>
        </div>
    )
}