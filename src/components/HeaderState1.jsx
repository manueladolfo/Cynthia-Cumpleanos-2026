import React from 'react';

export default function HeaderState1() {
  return (
    <header className="w-full text-center relative z-10 mb-6 flex flex-col items-center">
      {/* Badge Superior */}
      <span className="inline-flex items-center gap-2 font-badge text-2xl font-bold tracking-widest text-[#9F1239] bg-rose-50/90 border-2 border-dashed border-rose-300 px-5 py-1 rounded-full mb-3 shadow-sm backdrop-blur-md">
        PARA ALGUIEN MUY ESPECIAL
      </span>

      {/* Emblema Artístico Cynthia con Motivos Mexicanos */}
      <div className="relative w-full max-w-[375px] h-[185px] my-1 flex items-center justify-center">
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible drop-shadow-sm" 
          viewBox="0 0 420 210" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          aria-hidden="true"
        >
          {/* Dalia / Flor Mexicana Central Superior */}
          <g className="mexican-flower-top">
            <path d="M 210 34 C 203 18, 203 7, 210 5 C 217 7, 217 18, 210 34 Z" fill="#E4007C"/>
            <path d="M 210 34 C 196 23, 187 17, 192 13 C 198 12, 204 23, 210 34 Z" fill="#FFB703"/>
            <path d="M 210 34 C 224 23, 233 17, 228 13 C 222 12, 216 23, 210 34 Z" fill="#FFB703"/>
            <path d="M 210 34 C 193 30, 185 35, 187 40 C 193 42, 202 38, 210 34 Z" fill="#00A896"/>
            <path d="M 210 34 C 227 30, 235 35, 233 40 C 227 42, 218 38, 210 34 Z" fill="#00A896"/>
            <path d="M 210 34 C 197 45, 192 51, 197 55 C 203 54, 206 45, 210 34 Z" fill="#FB8500"/>
            <path d="M 210 34 C 223 45, 228 51, 223 55 C 217 54, 214 45, 210 34 Z" fill="#FB8500"/>
            {/* Núcleo de flor */}
            <circle cx="210" cy="34" r="8" fill="#FFB703"/>
            <circle cx="210" cy="34" r="4" fill="#E4007C"/>
          </g>

          {/* Enredaderas botánicas superiores estilo Tenango */}
          <path d="M 182 36 C 132 26, 80 44, 48 86" stroke="#2D6A4F" strokeWidth="2.6" strokeLinecap="round"/>
          <path d="M 238 36 C 288 26, 340 44, 372 86" stroke="#2D6A4F" strokeWidth="2.6" strokeLinecap="round"/>

          {/* Hojas bordadas mexicanas superiores izquierdas */}
          <path d="M 162 28 Q 150 17, 143 25 Q 153 32, 162 28 Z" fill="#2D6A4F"/>
          <path d="M 136 32 Q 126 19, 118 27 Q 128 35, 136 32 Z" fill="#FFB703"/>
          <path d="M 112 40 Q 99 29, 93 38 Q 103 46, 112 40 Z" fill="#E4007C"/>
          <path d="M 88 52 Q 74 43, 69 53 Q 80 60, 88 52 Z" fill="#00A896"/>
          <path d="M 68 68 Q 54 60, 51 70 Q 61 76, 68 68 Z" fill="#FB8500"/>

          {/* Hojas bordadas mexicanas superiores derechas */}
          <path d="M 258 28 Q 270 17, 277 25 Q 267 32, 258 28 Z" fill="#2D6A4F"/>
          <path d="M 284 32 Q 294 19, 302 27 Q 292 35, 284 32 Z" fill="#FFB703"/>
          <path d="M 308 40 Q 321 29, 327 38 Q 317 46, 308 40 Z" fill="#E4007C"/>
          <path d="M 332 52 Q 346 43, 351 53 Q 340 60, 332 52 Z" fill="#00A896"/>
          <path d="M 352 68 Q 366 60, 369 70 Q 359 76, 352 68 Z" fill="#FB8500"/>

          {/* Banderitas / Festón papel picado sutil superior */}
          <polygon points="120,44 128,42 124,52" fill="#E4007C"/>
          <polygon points="146,38 154,36 150,46" fill="#00A896"/>
          <polygon points="266,36 274,38 270,46" fill="#00A896"/>
          <polygon points="292,42 300,44 296,52" fill="#E4007C"/>

          {/* Flores laterales estilo Tenango */}
          <g className="mexican-flower-left">
            <circle cx="44" cy="94" r="6" fill="#FFB703"/>
            <circle cx="44" cy="94" r="3" fill="#FB8500"/>
            <path d="M 44 88 C 42 81, 46 81, 44 88 Z" stroke="#E4007C" strokeWidth="4" strokeLinecap="round"/>
            <path d="M 44 100 C 42 107, 46 107, 44 100 Z" stroke="#E4007C" strokeWidth="4" strokeLinecap="round"/>
            <path d="M 38 94 C 31 92, 31 96, 38 94 Z" stroke="#00A896" strokeWidth="4" strokeLinecap="round"/>
            <path d="M 50 94 C 57 92, 57 96, 50 94 Z" stroke="#00A896" strokeWidth="4" strokeLinecap="round"/>
          </g>

          <g className="mexican-flower-right">
            <circle cx="376" cy="94" r="6" fill="#FFB703"/>
            <circle cx="376" cy="94" r="3" fill="#E4007C"/>
            <path d="M 376 88 C 374 81, 378 81, 376 88 Z" stroke="#00A896" strokeWidth="4" strokeLinecap="round"/>
            <path d="M 376 100 C 374 107, 378 107, 376 100 Z" stroke="#00A896" strokeWidth="4" strokeLinecap="round"/>
            <path d="M 370 94 C 363 92, 363 96, 370 94 Z" stroke="#E4007C" strokeWidth="4" strokeLinecap="round"/>
            <path d="M 382 94 C 389 92, 389 96, 382 94 Z" stroke="#E4007C" strokeWidth="4" strokeLinecap="round"/>
          </g>

          {/* Trazo caligráfico de base estilo 'Felicitaciones' */}
          <path d="M 68 138 C 112 174, 180 162, 248 152 C 304 143, 348 149, 355 134 C 362 120, 342 114, 325 122 C 305 130, 255 146, 202 153 C 142 161, 90 154, 82 135" stroke="#0B4F6C" strokeWidth="4" strokeLinecap="round"/>

          {/* Enredadera botánica inferior con Dalia pequeña centrada */}
          <path d="M 210 182 C 168 184, 126 176, 92 156" stroke="#2D6A4F" strokeWidth="2.2" strokeLinecap="round"/>
          <path d="M 210 182 C 252 184, 294 176, 328 156" stroke="#2D6A4F" strokeWidth="2.2" strokeLinecap="round"/>

          {/* Hojas inferiores bordadas */}
          <path d="M 184 180 Q 174 190, 168 182 Q 178 175, 184 180 Z" fill="#FB8500"/>
          <path d="M 152 178 Q 142 188, 136 180 Q 146 173, 152 178 Z" fill="#00A896"/>
          <path d="M 120 172 Q 110 181, 105 174 Q 115 167, 120 172 Z" fill="#FFB703"/>

          <path d="M 236 180 Q 246 190, 252 182 Q 242 175, 236 180 Z" fill="#E4007C"/>
          <path d="M 268 178 Q 278 188, 284 180 Q 274 173, 268 178 Z" fill="#00A896"/>
          <path d="M 300 172 Q 310 181, 315 174 Q 305 167, 300 172 Z" fill="#FFB703"/>

          {/* Flor central inferior */}
          <g className="mexican-flower-bottom">
            <circle cx="210" cy="182" r="6" fill="#FFB703"/>
            <circle cx="210" cy="182" r="2.5" fill="#FB8500"/>
            <circle cx="203" cy="182" r="3.5" fill="#E4007C"/>
            <circle cx="217" cy="182" r="3.5" fill="#E4007C"/>
            <circle cx="210" cy="175" r="3.5" fill="#00A896"/>
            <circle cx="210" cy="189" r="3.5" fill="#00A896"/>
          </g>

          {/* Puntos de confeti mexicano en colores vivos */}
          <circle cx="95" cy="22" r="3.5" fill="#FFB703"/>
          <circle cx="325" cy="22" r="3.5" fill="#E4007C"/>
          <circle cx="40" cy="62" r="3" fill="#00A896"/>
          <circle cx="380" cy="62" r="3" fill="#FB8500"/>
          <circle cx="30" cy="120" r="3.5" fill="#E4007C"/>
          <circle cx="390" cy="120" r="3.5" fill="#00A896"/>
          <circle cx="75" cy="182" r="3.5" fill="#FFB703"/>
          <circle cx="345" cy="182" r="3.5" fill="#FB8500"/>
          <circle cx="170" cy="196" r="3" fill="#E4007C"/>
          <circle cx="250" cy="196" r="3" fill="#00A896"/>
        </svg>

        {/* Nombre Cynthia */}
        <h1 className="font-cynthia text-[3.8rem] sm:text-[4.6rem] font-normal text-[#0B4F6C] tracking-wide leading-none relative z-10 m-0 p-0 drop-shadow-sm select-none -translate-y-1 hover:scale-105 transition-transform duration-300">
          Cynthia
        </h1>
      </div>

      {/* Subtítulo espaciado y enmarcado */}
      <div className="mt-3.5 flex justify-center w-full relative z-10">
        <p className="font-subheading text-lg text-slate-600 font-normal leading-relaxed max-w-[340px] m-0 bg-white/85 border border-rose-200/80 px-5 py-1.5 rounded-full shadow-sm">
          Tengo una sorpresa preparada para ti
        </p>
      </div>
    </header>
  );
}
