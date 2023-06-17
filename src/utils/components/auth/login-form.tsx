export const LoginForm = () => {
    const onSubmit = () => {

    }

    const errorText = null;
    return <>
        <form className="max-w-[80%] mx-auto grid" onSubmit={onSubmit}>
            <input className="input" v-model="username" placeholder="Email"/>
            <input type="password" className="input" v-model="password" placeholder="Password"/>
            {errorText && <p className="danger">{errorText}</p>}
            <button className="button button-primary" type="submit" v-spinner="loading">Login</button>
        </form>
    </>
}