import React, {useState, useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import GlassSurface from './GlassSurface';
import {config, whatsappUrl} from './config';

function Icon({name, size=20, ...props}) {
  const paths = {
    arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    diagonal: <><path d="M6 18 18 6M6 6h12v12"/></>,
    pin: <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z"/><circle cx="12" cy="10" r="2.3"/></>,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/></>,
    whatsapp: <g fill="currentColor" stroke="none"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12.001 2C6.478 2 2 6.477 2 12c0 1.876.52 3.632 1.42 5.13L2 22l4.994-1.396A9.958 9.958 0 0012 22c5.523 0 10-4.477 10-10S17.524 2 12.001 2zm0 18.148a8.13 8.13 0 01-4.144-1.132l-.297-.176-3.033.849.826-3.02-.194-.31A8.14 8.14 0 013.85 12C3.85 7.502 7.502 3.85 12 3.85c4.498 0 8.15 3.652 8.15 8.15 0 4.499-3.652 8.148-8.149 8.148z"/></g>,
    check: <path d="m5 12 4 4L19 6"/>,
    photo: <><rect x="3" y="5" width="18" height="15" rx="3"/><path d="m3 16 5-5 5 5 3-3 5 5"/><circle cx="16" cy="9" r="1"/></>,
    send: <><path d="m21 3-7 18-4-7-7-4 18-7ZM10 14 21 3"/></>,
    phone: <><rect x="6" y="2" width="12" height="20" rx="3"/><path d="M10 18h4"/></>,
    plus: <path d="M12 5v14M5 12h14"/>,
    menu: <path d="M4 7h16M4 12h16M4 17h16"/>,
    close: <path d="m6 6 12 12M6 18 18 6"/>
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name] || paths.arrow}</svg>;
}
function InstagramLogo({size=24, id='ig'}) {
  return <svg width={size} height={size} viewBox="0 0 48 48" role="img" aria-label="Instagram">
    <defs><radialGradient id={id} cx="30%" cy="107%" r="150%">
      <stop offset="0%" stopColor="#fdf497"/><stop offset="5%" stopColor="#fdf497"/><stop offset="45%" stopColor="#fd5949"/><stop offset="60%" stopColor="#d6249f"/><stop offset="90%" stopColor="#285AEB"/>
    </radialGradient></defs>
    <rect width="48" height="48" rx="13" fill={`url(#${id})`}/>
    <rect x="12.5" y="12.5" width="23" height="23" rx="6.5" fill="none" stroke="#fff" strokeWidth="2.4"/>
    <circle cx="24" cy="24" r="6" fill="none" stroke="#fff" strokeWidth="2.4"/>
    <circle cx="32.4" cy="15.6" r="1.7" fill="#fff"/>
  </svg>;
}
function Brand() {return <a className="brand" href="#top" aria-label="Колесо Шымкент — в начало"><img src="assets/favicon.svg" alt="" width="40" height="40"/><span>koleso<span className="brand-dot">.</span><small>SHYMKENT</small></span></a>}
function External({href, children, ...props}) {return <a href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>}
function WhatsApp({children='Разместить объявление', className=''}) {return <External href={whatsappUrl} className={'button button-dark '+className}><Icon name="whatsapp"/><span>{children}</span><Icon name="diagonal" size={18}/></External>}

function App() {
  const [menuOpen,setMenuOpen]=useState(false);
  useEffect(()=>{
    const close=e=>{if(e.key==='Escape')setMenuOpen(false)};
    window.addEventListener('keydown',close);
    const resize=()=>{if(window.innerWidth>760)setMenuOpen(false)};
    window.addEventListener('resize',resize);
    return ()=>{window.removeEventListener('keydown',close);window.removeEventListener('resize',resize)};
  },[]);
  return <>
    <a className="skip-link" href="#main">Перейти к содержимому</a>
    <header className="header">
      <GlassSurface width="100%" height="auto" borderRadius={24} distortionScale={-45} redOffset={0} greenOffset={3} blueOffset={6} blur={8} backgroundOpacity={.72} saturation={1.1} className="header-glass">
        <div className="header-inner">
          <Brand/>
          <nav className="desktop-nav" aria-label="Основная навигация"><a href="#how">Как это работает</a><a href="#community">Наш Instagram</a><a href="#faq">Вопросы</a></nav>
          <External href={whatsappUrl} className="header-cta">Продать авто <Icon name="diagonal" size={17}/></External>
          <button className="menu-toggle" aria-label={menuOpen?'Закрыть меню':'Открыть меню'} aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={()=>setMenuOpen(!menuOpen)}><Icon name={menuOpen?'close':'menu'}/></button>
        </div>
      </GlassSurface>
      <nav id="mobile-menu" className="mobile-menu" hidden={!menuOpen} aria-label="Мобильная навигация">
        {[['#how','Как это работает'],['#community','Наш Instagram'],['#faq','Вопросы']].map(([href,text])=><a key={href} href={href} onClick={()=>setMenuOpen(false)}>{text}<Icon name="arrow"/></a>)}
      </nav>
    </header>
    <main id="main">
      <section className="hero container" id="top">
        <div className="hero-heading">
          <div><div className="eyebrow"><span className="status-dot"/><span>АВТОМОБИЛЬНОЕ СООБЩЕСТВО ШЫМКЕНТА</span></div>
          <h1>Ваше авто найдёт<br/>своего <span className="highlight">человека<svg viewBox="0 0 400 16" preserveAspectRatio="none" aria-hidden="true"><path d="M3 11Q195-2 396 8"/></svg></span><span className="full-stop">.</span></h1></div>
          <div className="hero-intro"><p>Вы готовы к новому.<br/>А кто-то мечтает о вашем авто.<br/><strong>Поможем вам встретиться.</strong></p><a className="text-link" href="#how">Всё начинается с объявления <Icon name="diagonal" size={18}/></a></div>
        </div>
        <div className="hero-stage">
          <img className="hero-photo" src="assets/hero.webp" alt="Серебристый седан на фоне светлой архитектуры и гор" width="1536" height="1024" fetchPriority="high"/>
          <div className="photo-topline"><span className="location-label"><Icon name="pin" size={15}/> Шымкент, Казахстан</span><span className="photo-counter">01 — ВАША СЛЕДУЮЩАЯ ГЛАВА</span></div>
          <div className="hero-bottom">
            <GlassSurface width="auto" height="auto" borderRadius={22} distortionScale={-65} greenOffset={4} blueOffset={8} backgroundOpacity={.78} saturation={1.15} className="hero-action-glass">
              <div className="hero-action"><span className="hero-action-caption">Хорошему авто — хорошего владельца</span><WhatsApp/><span className="microcopy">Условия и стоимость — в WhatsApp</span></div>
            </GlassSurface>
            <a href="#community" className="audience-card"><span className="audience-icon"><InstagramLogo size={45} id="ig-audience"/></span><div><strong>{config.followers}</strong><span>подписчиков в Instagram</span></div><Icon name="diagonal" size={21}/></a>
          </div>
        </div>
        <div className="hero-footnote"><span>Автомобили меняются. Любовь к ним остаётся.</span><span>Листайте, познакомимся ближе <span aria-hidden="true">↓</span></span></div>
      </section>
      <section className="trust-strip container" aria-label="О сообществе">
        <p>Местное сообщество.<br/><strong>Большие возможности.</strong></p>
        <div><strong>{config.years}<span> лет</span></strong><span>помогаем продавать авто</span></div>
        <div><strong>{config.posts}</strong><span>публикации в профиле</span></div>
        <div><strong>Шымкент<span> ↗</span></strong><span>наш город. наша аудитория.</span></div>
      </section>
      <section className="section container" id="how">
        <div className="section-heading"><div><span className="eyebrow">01 / ПРОСТО И ПО ДЕЛУ</span><h2>От «продаю»<br/>до «давайте посмотрим».</h2></div><p>Вы рассказываете об автомобиле.<br/>Мы знакомим с ним нашу аудиторию.</p></div>
        <div className="steps">
          <article className="step"><div className="step-top"><span className="step-icon"><Icon name="photo" size={26}/></span><span>01</span></div><h3>Покажите ваше авто</h3><p>Отправьте в WhatsApp фотографии, марку, год, пробег и желаемую цену.</p><span className="step-note">Начнём с одного сообщения <Icon name="arrow" size={17}/></span></article>
          <article className="step"><div className="step-top"><span className="step-icon"><Icon name="send" size={26}/></span><span>02</span></div><h3>Доверьте нам публикацию</h3><p>Согласуем стоимость и детали размещения. Подготовим объявление для нашей страницы.</p><span className="step-note">Ваш автомобиль в нашей ленте <Icon name="arrow" size={17}/></span></article>
          <article className="step step-lime"><div className="step-top"><span className="step-icon"><Icon name="phone" size={26}/></span><span>03</span></div><h3>Знакомьтесь с покупателями</h3><p>Отвечайте на обращения, договаривайтесь о просмотре и обсуждайте продажу напрямую.</p><span className="step-note">Дальше — ваш новый маршрут <Icon name="arrow" size={17}/></span></article>
        </div>
      </section>
      <section className="community-section" id="community"><div className="container community-grid">
        <div className="editorial-photo"><img src="assets/interior.webp" alt="Детали автомобильного салона с кожаной отделкой в тёплых тонах" width="1536" height="1024" loading="lazy"/><span className="editorial-caption">У каждого авто — своя история.</span><span className="editorial-number">02 / ДЕТАЛИ РЕШАЮТ</span></div>
        <div className="community-copy"><span className="eyebrow">02 / МЕСТО ВСТРЕЧИ — INSTAGRAM</span><h2>Ваша следующая<br/>встреча —<br/><span className="muted-heading">в нашей ленте.</span></h2><p>Автомобили Шымкента и люди, которые их ищут. Посмотрите объявления, познакомьтесь со страницей и представьте здесь своё авто.</p>
          <div className="profile-row"><span className="instagram-badge"><InstagramLogo size={48} id="ig-profile"/></span><div><strong>@{config.handle}</strong><span>{config.followers} подписчиков</span></div></div>
          <External href={config.instagram} className="button button-outline">Смотреть объявления <Icon name="diagonal"/></External>
          <p className="community-note">Актуальные автомобили и цены — в Instagram.</p>
        </div>
      </div></section>
      <section className="section container faq-section" id="faq"><div className="faq-heading"><span className="eyebrow">03 / ЕСТЬ ВОПРОСЫ?</span><h2>Давайте<br/>разберёмся.</h2><p>А если остались вопросы —<br/><External href={whatsappUrl} className="inline-link">мы рядом в WhatsApp <Icon name="diagonal" size={15}/></External></p></div>
        <div className="faq-list">
          {[
            ['Сколько стоит разместить объявление?','Стоимость зависит от формата размещения. Напишите нам в WhatsApp — расскажем об актуальных условиях и согласуем их до публикации.'],
            ['Что нужно отправить для публикации?','Фотографии автомобиля, марку и модель, год выпуска, пробег, состояние, цену и контакт для покупателей. Если есть важные особенности, обязательно расскажите о них.'],
            ['Вы выкупаете автомобили?','Мы размещаем объявления в нашем Instagram. Покупатели связываются с продавцом напрямую, а условия просмотра и сделки вы обсуждаете самостоятельно.'],
            ['Как быстро получится продать машину?','Срок зависит от автомобиля, его состояния, цены и спроса. Размещение помогает показать ваше предложение аудитории страницы; конкретный срок продажи мы не обещаем.']
          ].map(([q,a])=><details key={q}><summary>{q}<span className="faq-plus"><Icon name="plus" size={18}/></span></summary><p>{a}</p></details>)}
        </div>
      </section>
      <section className="contact-section container" id="contact"><div className="contact-card"><div className="contact-orbit" aria-hidden="true"/><div><span className="eyebrow"><span className="status-dot"/> ВАШ НОВЫЙ МАРШРУТ НАЧИНАЕТСЯ ЗДЕСЬ</span><h2>Пора двигаться<br/>к новому<span>↗</span></h2><p>А продажу начнём с простого «Здравствуйте».</p></div><div className="contact-action"><WhatsApp>Написать в WhatsApp</WhatsApp><a href={'tel:+'+config.whatsapp}>{config.phone}</a></div></div></section>
    </main>
    <footer className="container footer"><div className="footer-top"><Brand/><p>Соединяем людей.<br/>Помогаем продавать автомобили.</p><External href={config.instagram}>Instagram <Icon name="diagonal" size={16}/></External><External href={whatsappUrl}>WhatsApp <Icon name="diagonal" size={16}/></External><a className="back-top" href="#top" aria-label="Вернуться наверх">↑</a></div>
      <div className="requisites"><h3 className="requisites-title">Реквизиты / о компании / контакты</h3>
        <div className="requisites-grid">
          <div><span>Название ИП</span><strong>{config.requisites.name}</strong></div>
          <div><span>БИН/ИИН</span><strong>{config.requisites.bin}</strong></div>
          <div><span>Юридический адрес</span><strong>{config.requisites.address}</strong></div>
          <div><span>Телефон</span><a href={'tel:'+config.requisites.phoneHref}>{config.requisites.phone}</a></div>
          <div><span>Email</span><a href={'mailto:'+config.requisites.email}>{config.requisites.email}</a></div>
          <div><span>Вид деятельности</span><strong>{config.requisites.activity}</strong></div>
        </div>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} Колесо Шымкент</span><span>Фотографии — иллюстрации. Объявления — в Instagram.</span><span>С любовью к авто и нашему городу.</span></div></footer>
    <div className="mobile-bottom"><WhatsApp>Продать мой автомобиль</WhatsApp></div>
  </>;
}
createRoot(document.getElementById('root')).render(<App/>);
