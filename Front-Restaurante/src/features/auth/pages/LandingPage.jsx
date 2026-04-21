import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import FileteAlCarbon from "../../../../src/assets/FileteAlCarbon.png";
import LavaCake from "../../../../src/assets/LavaCake.png";
import RissotoDeHongos from "../../../../src/assets/RissotoDeHongos.png";
import SalmonGlaseado from "../../../../src/assets/SalmonGlaseado.png";
import CocinaFondo from "../../../../src/assets/CocinaFondo.png";

const menuItems = [
    {
        name: 'Filete al Carbón',
        desc: 'Corte premium con mantequilla de hierbas y papas al romero',
        price: 'Q185',
        tag: "Chef's Pick",
        img: FileteAlCarbon
    },
    {
        name: 'Risotto de Hongos',
        desc: 'Cremoso arroz arborio con porcini, parmesano y aceite de trufa',
        price: 'Q145',
        tag: 'Favorito',
        img: RissotoDeHongos   // ← corregido el typo
    },
    {
        name: 'Salmón Glaseado',
        desc: 'Salmón atlántico con glaseado de miso, edamame y jengibre',
        price: 'Q165',
        tag: 'Nuevo',
        img: SalmonGlaseado
    },
    {
        name: 'Lava Cake',
        desc: 'Volcán de chocolate belga con helado de vainilla artesanal',
        price: 'Q75',
        tag: 'Postre',
        img: LavaCake
    },
]

export const LandingPage = () => {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
        setMenuOpen(false)
    }

    return (
        <div className="bg-[#0f0e0c] text-[#f5f0e8] min-h-screen font-sans overflow-x-hidden">

        {/* ── NAVBAR ── */}
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            scrolled ? 'bg-[#0f0e0c]/95 backdrop-blur border-b border-white/5 py-3' : 'py-5'
        }`}>
            <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">

            {/* Logo */}
            <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">K</span>
                </div>
                <span className="font-semibold text-[15px] tracking-tight">Kinal Gourmet</span>
            </div>

            {/* Links desktop */}
            <div className="hidden md:flex items-center gap-8">
                {[['Inicio','hero'],['Menú','menu'],['Nosotros','about'],['Contacto','contact']].map(([label, id]) => (
                <button key={id} onClick={() => scrollTo(id)}
                    className="text-sm text-white/50 hover:text-white transition-colors">
                    {label}
                </button>
                ))}
            </div>

            {/* Login button */}
            <div className="flex items-center gap-3">
                <Link to="/login"
                className="hidden md:flex items-center gap-2 text-sm bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full transition-all font-medium">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="11" rx="2"/>
                    <path strokeLinecap="round" d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Iniciar sesión
                </Link>

                {/* Mobile menu toggle */}
                <button className="md:hidden p-2 text-white/60 hover:text-white"
                onClick={() => setMenuOpen(!menuOpen)}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    {menuOpen
                    ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                    : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
                    }
                </svg>
                </button>
            </div>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
            <div className="md:hidden bg-[#1a1815] border-t border-white/5 px-6 py-4 flex flex-col gap-4">
                {[['Inicio','hero'],['Menú','menu'],['Nosotros','about'],['Contacto','contact']].map(([label, id]) => (
                <button key={id} onClick={() => scrollTo(id)}
                    className="text-sm text-white/60 hover:text-white text-left transition-colors">
                    {label}
                </button>
                ))}
                <Link to="/login"
                className="flex items-center gap-2 text-sm bg-orange-500 text-white px-4 py-2.5 rounded-full font-medium w-fit">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="11" rx="2"/>
                    <path strokeLinecap="round" d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Iniciar sesión
                </Link>
            </div>
            )}
        </nav>

        {/* ── HERO ── */}
        <section id="hero" className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-16 relative">

            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-orange-500/5 blur-3xl" />
            <div className="absolute top-20 right-20 w-2 h-2 rounded-full bg-orange-400/40" />
            <div className="absolute bottom-32 left-24 w-1.5 h-1.5 rounded-full bg-orange-400/30" />
            <div className="absolute top-40 left-1/3 w-1 h-1 rounded-full bg-white/20" />
            </div>

            <div className="relative z-10 max-w-3xl mx-auto">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-xs text-white/60 mb-8 tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse"/>
                Restaurante gourmet · Guatemala
            </div>

            <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-2 leading-none">
                Kinal
            </h1>
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight mb-6 leading-none text-orange-400">
                Gourmet House
            </h1>

            <p className="text-lg md:text-xl text-white/40 font-light mb-10 tracking-wide">
                Más que comida, una experiencia
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button onClick={() => scrollTo('menu')}
                className="bg-orange-500 hover:bg-orange-600 text-white px-7 py-3 rounded-full text-sm font-medium transition-all hover:scale-105">
                Ver el menú
                </button>
                <button onClick={() => scrollTo('about')}
                className="border border-white/15 hover:border-white/30 text-white/70 hover:text-white px-7 py-3 rounded-full text-sm transition-all">
                Conoce más
                </button>
            </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20">
            <span className="text-xs tracking-widest uppercase">scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent"/>
            </div>
        </section>

        {/* ── MENÚ DESTACADO ── */}
        <section id="menu" className="py-24 px-6">
            <div className="max-w-5xl mx-auto">

            <div className="mb-14">
                <p className="text-orange-400 text-xs tracking-widest uppercase mb-3">Lo mejor de la casa</p>
                <h2 className="text-3xl md:text-4xl font-light">Menú <span className="font-semibold">destacado</span></h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {menuItems.map((item, i) => (
                    <div key={i}
                    className="group bg-white/3 hover:bg-white/6 border border-white/8 hover:border-orange-500/30 rounded-2xl overflow-hidden transition-all duration-300 cursor-default">

                    {/* IMAGEN ARRIBA */}
                    <div className="w-full h-48 overflow-hidden">
                        <img
                        src={item.img}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    </div>

                    {/* CONTENIDO ABAJO */}
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-3">
                        <span className="text-xs bg-orange-500/15 text-orange-400 border border-orange-500/20 px-2.5 py-1 rounded-full">
                            {item.tag}
                        </span>
                        <span className="text-base font-semibold text-orange-400">{item.price}</span>
                        </div>
                        <h3 className="font-medium text-[15px] mb-1.5">{item.name}</h3>
                        <p className="text-sm text-white/40 leading-relaxed">{item.desc}</p>
                    </div>

                    </div>
                ))}
                </div>
            </div>
        </section>

        {/* ── SOBRE NOSOTROS ── */}
        <section id="about" className="py-24 px-6 border-t border-white/5">
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">

            <div>
                <p className="text-orange-400 text-xs tracking-widest uppercase mb-3">Quiénes somos</p>
                <h2 className="text-3xl md:text-4xl font-light mb-6">
                Cocina con <span className="font-semibold">alma</span>
                </h2>
                <p className="text-white/50 leading-relaxed mb-4">
                En Kinal Gourmet House creemos que cada plato es una historia. Desde 2018, nuestro equipo de chefs combina técnicas clásicas con ingredientes locales para crear momentos únicos en la mesa.
                </p>
                <p className="text-white/50 leading-relaxed mb-8">
                Nuestro espacio fue diseñado para que te desconectes del mundo y te conectes con lo esencial: el sabor, la compañía y la experiencia.
                </p>

                <div className="grid grid-cols-3 gap-6">
                {[['6+', 'Años de experiencia'], ['2,400+', 'Clientes felices'], ['48', 'Platos en carta']].map(([num, label]) => (
                    <div key={label}>
                    <p className="text-2xl font-semibold text-orange-400">{num}</p>
                    <p className="text-xs text-white/40 mt-1 leading-tight">{label}</p>
                    </div>
                ))}
                </div>
            </div>

            {/* Visual block */}
            <div className="relative h-80 md:h-96 rounded-3xl overflow-hidden">
                <img
                    src={CocinaFondo}
                    alt="Nuestro restaurante"
                    className="w-full h-full object-cover"
                />
                {/* Overlay oscuro encima */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0e0c]/80 via-transparent to-transparent" />
                {/* Texto sobre la imagen */}
                <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-white/70 text-sm italic">
                    "La mesa es el lugar donde la vida cobra sentido"
                    </p>
                </div>
                {/* Decoraciones */}
                <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-2xl bg-orange-500/10 border border-orange-500/20"/>
                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-xl bg-white/3 border border-white/8"/>
                </div>
            </div>
        </section>

        {/* ── CONTACTO ── */}
        <section id="contact" className="py-24 px-6 border-t border-white/5">
            <div className="max-w-5xl mx-auto">

            <div className="mb-14">
                <p className="text-orange-400 text-xs tracking-widest uppercase mb-3">Encuéntranos</p>
                <h2 className="text-3xl md:text-4xl font-light">
                Visítanos <span className="font-semibold">pronto</span>
                </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {[
                {
                    icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        <path strokeLinecap="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    ),
                    label: 'Dirección',
                    value: 'Zona 10, Ciudad de Guatemala'
                },
                {
                    icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    ),
                    label: 'Horario',
                    value: 'Lun – Dom · 12:00 – 22:00'
                },
                {
                    icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                    ),
                    label: 'Teléfono',
                    value: '+502 2345-6789'
                }
                ].map(({ icon, label, value }) => (
                <div key={label} className="bg-white/3 border border-white/8 rounded-2xl p-6">
                    <div className="w-9 h-9 rounded-xl bg-orange-500/15 text-orange-400 flex items-center justify-center mb-4">
                    {icon}
                    </div>
                    <p className="text-xs text-white/30 uppercase tracking-wider mb-1">{label}</p>
                    <p className="text-sm text-white/70">{value}</p>
                </div>
                ))}
            </div>
            </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="border-t border-white/5 py-8 px-6">
            <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-orange-500 flex items-center justify-center">
                <span className="text-white font-bold text-xs">K</span>
                </div>
                <span className="text-sm text-white/40">Kinal Gourmet House</span>
            </div>
            <p className="text-xs text-white/20">© 2025 · Más que comida, una experiencia</p>
            <Link to="/login"
                className="flex items-center gap-1.5 text-xs text-white/30 hover:text-orange-400 transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path strokeLinecap="round" d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Acceso staff
            </Link>
            </div>
        </footer>

        </div>
    )
}
