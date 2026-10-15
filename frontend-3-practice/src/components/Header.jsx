export default function Header() {
    return (
        <header className="site-header">
            <a className="logo" href="#" aria-label="НЕБО — главная">НЕБО</a>
            <nav className="main-nav" aria-label="Основная навигация">
                <a href="#services">Услуги</a>
                <a href="#masters">Мастера</a>
                <a href="#reviews">Отзывы</a>
                <a href="#contacts">Контакты</a>
                <a className="nav-book-button" href="#booking">Записаться</a>
            </nav>
        </header>
    );
}
