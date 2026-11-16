import { InfractionData } from "@/types";

export const INFRACTIONS_DATA: InfractionData[] = [
  {
    id: "inf-1",
    slug: "utilizar-movil-conduciendo-mano",
    titulo: "Utilizar el teléfono móvil sujetándolo con la mano conduciendo",
    categoria: "Móvil y Distracciones",
    articulo: "Art. 76.g LSV",
    importe: 200,
    prontoPago: 100,
    puntos: 6,
    gravedad: "Grave",
    permiteProntoPago: true,
    resumen: "Sujetar el teléfono móvil con la mano mientras se conduce, incluso en detenciones de semáforo o atascos.",
    descripcion: "Desde la reforma de la Ley de Tráfico de 2022, la simple acción de sujetar el teléfono móvil con la mano mientras se conduce (o mientras el vehículo está detenido en un semáforo o stop) está tipificada como infracción grave y sancionada con la retirada de 6 puntos del carnet y 200 € de multa.",
    baseLegal: "Ley sobre Tráfico, Circulación de Vehículos a Motor y Seguridad Vial, Art. 76.g y Anexo II.",
    plazoRecuperacion: "2 años continuados sin cometer infracciones graves para restablecer el saldo de puntos inicial (hasta 12 puntos).",
    comoRecurrir: "A través del pliego de descargos en los primeros 20 días naturales ante la DGT, solicitando prueba fotográfica fehaciente o ratificación detallada del agente si no hubo toma fotográfica.",
    consejos: [
      "Utiliza siempre soportes homologados adheridos al salpicadero, nunca al cristal impidiendo la visión.",
      "No toques la pantalla ni manipules el móvil en detenciones temporales de tráfico o semáforos rojos.",
      "Configura el modo 'No Molestar al Volante' de tu smartphone."
    ],
    faq: [
      {
        pregunta: "¿Me pueden multar si estoy parado en un semáforo rojo con el móvil en la mano?",
        respuesta: "Sí. El vehículo sigue en situación de conducción y circulación, por lo que la sanción de 200 € y 6 puntos aplica con la misma validez."
      },
      {
        pregunta: "¿Puedo usar el móvil con soporte homologado?",
        respuesta: "Sí, siempre que no se manipule en marcha. Manipularlo en el soporte en marcha acarrea 200 € y 3 puntos."
      }
    ]
  },
  {
    id: "inf-2",
    slug: "no-llevar-cinturon-seguridad-sri",
    titulo: "No llevar puesto el cinturón de seguridad o sistema de retención infantil (SRI)",
    categoria: "Seguridad y Cinturón",
    articulo: "Art. 76.h LSV",
    importe: 200,
    prontoPago: 100,
    puntos: 4,
    gravedad: "Grave",
    permiteProntoPago: true,
    resumen: "No hacer uso del cinturón de seguridad, casco o sistemas de retención infantil obligatorios.",
    descripcion: "No utilizar el cinturón de seguridad, sistema de retención infantil (sillita obligatoria para menores de estatura igual o menor a 135 cm) o el casco de protección en motocicletas o ciclomotores supone la retirada directa de 4 puntos y 200 €.",
    baseLegal: "Ley sobre Tráfico y Seguridad Vial (Art. 76.h y Anexo II).",
    plazoRecuperacion: "2 años sin cometer infracciones graves.",
    comoRecurrir: "Presentar informe médico de exención oficial si se posee, o impugnar falta de nitidez en la imagen del radar de cabina/cámara de vigilancia.",
    consejos: [
      "Asegúrate de que todos los ocupantes lleven cinturón antes de iniciar la marcha.",
      "Los menores de altura inferior o igual a 135 cm deben ir siempre en asientos traseros con SRI homologado."
    ],
    faq: [
      {
        pregunta: "¿Quién paga la multa si un pasajero adulto no lleva cinturón?",
        respuesta: "El propio pasajero abona los 200 €, pero no se retiran puntos al conductor. Si es un menor sin SRI, la responsabilidad recae en el conductor/tutor."
      }
    ]
  },
  {
    id: "inf-3",
    slug: "tasa-alcohol-positiva-general",
    titulo: "Conducir con tasa de alcohol entre 0,25 y 0,50 mg/l (aire espirado)",
    categoria: "Alcohol y Drogas",
    articulo: "Art. 77.c LSV",
    importe: 500,
    prontoPago: 250,
    puntos: 4,
    gravedad: "Muy Grave",
    permiteProntoPago: true,
    resumen: "Superar la tasa de alcoholemia reglamentaria general (0,25 mg/l en aire o 0,50 g/l en sangre) hasta 0,50 mg/l.",
    descripcion: "La conducción con tasa de alcohol superior a 0,25 mg/l y hasta 0,50 mg/l en aire espirado (o entre 0,15 y 0,30 mg/l en noveles y profesionales) es una infracción muy grave castigada con 500 € y la detracción de 4 puntos.",
    baseLegal: "Art. 77.c Ley de Seguridad Vial y Art. 20 Reglamento General de Circulación.",
    plazoRecuperacion: "2 años sin nuevas infracciones graves o muy graves para recuperar los puntos.",
    comoRecurrir: "Comprobar el margen de error del etilómetro (7,5% en aparatos evidenciales), certificado de calibración en vigor del Centro Español de Metrología y respeto del tiempo de espera entre las dos pruebas reglamentarias.",
    consejos: [
      "La única tasa verdaderamente segura al volante es 0,0 g/l.",
      "Recuerda que en conductores menores de 18 años (ciclomotores, patinetes, etc.) la tasa legal es estrictamente 0,0."
    ],
    faq: [
      {
        pregunta: "¿Tengo derecho a una segunda prueba de alcoholímetro?",
        respuesta: "Sí, es obligatoria una segunda prueba transcurridos al menos 10 minutos con etilómetro de precisión homologado."
      }
    ]
  },
  {
    id: "inf-4",
    slug: "tasa-alcohol-positiva-alta-reincidencia",
    titulo: "Conducir con alcohol superior a 0,50 mg/l o reincidencia en el año",
    categoria: "Alcohol y Drogas",
    articulo: "Art. 77.c LSV & Art. 379.2 CP",
    importe: 1000,
    prontoPago: 500,
    puntos: 6,
    gravedad: "Muy Grave",
    permiteProntoPago: true,
    resumen: "Superar los 0,50 mg/l en aire espirado (0,30 mg/l noveles/profesionales) o reincidir en menos de un año.",
    descripcion: "Multa de 1.000 € y 6 puntos. Si además la tasa supera los 0,60 mg/l en aire (o 1,2 g/l en sangre), pasa de sanción administrativa a delito penal flagrante según el Art. 379.2 del Código Penal, acarreando penas de prisión o trabajos comunitarios y retirada judicial del permiso de 1 a 4 años.",
    baseLegal: "Art. 77.c Ley de Tráfico y Art. 379.2 Código Penal.",
    plazoRecuperacion: "Cursos de sensibilización y reeducación vial, y 2 años sin infracciones graves.",
    comoRecurrir: "Verificación de los márgenes metrológicos y de la cadena de custodia de la prueba.",
    consejos: [
      "Designa conductor alternativo o utiliza transporte público tras eventos festivos."
    ],
    faq: [
      {
        pregunta: "¿A partir de qué tasa de alcohol es delito penal?",
        respuesta: "A partir de 0,60 mg/l en aire espirado (o 1,2 g/l en sangre) se abren diligencias penales por delito contra la seguridad vial con juicio rápido."
      }
    ]
  },
  {
    id: "inf-5",
    slug: "conducir-con-presencia-de-drogas",
    titulo: "Conducir con presencia de drogas o estupefacientes en el organismo",
    categoria: "Alcohol y Drogas",
    articulo: "Art. 77.c LSV & Art. 379.2 CP",
    importe: 1000,
    prontoPago: 500,
    puntos: 6,
    gravedad: "Muy Grave",
    permiteProntoPago: true,
    resumen: "Dar positivo en drogas (THC, cocaína, anfetaminas, etc.) en control de saliva (DrugTest).",
    descripcion: "La conducción con presencia de drogas en el organismo está tipificada como infracción muy grave sancionada con 1.000 € de multa y retirada de 6 puntos. Quedan excluidas las sustancias administradas bajo prescripción facultativa con fines terapéuticos siempre que no alteren las facultades psicofísicas.",
    baseLegal: "Art. 77.c de la Ley de Seguridad Vial.",
    plazoRecuperacion: "2 años sin infracciones graves o muy graves.",
    comoRecurrir: "Solicitar análisis toxicológico de contraste en laboratorio toxicológico forense homologado y verificar la cadena de custodia de las muestras salivales.",
    consejos: [
      "Determinados metabolitos pueden persistir durante días en el cuerpo; no consumas si prevés conducir."
    ],
    faq: [
      {
        pregunta: "¿Puedo solicitar análisis de sangre para contrastar el test de saliva?",
        respuesta: "Sí, el conductor tiene derecho a contrastar el resultado mediante análisis de sangre clínico. Si da positivo, los gastos del análisis recaen en el interesado."
      }
    ]
  },
  {
    id: "inf-6",
    slug: "circular-con-itv-caducada",
    titulo: "Circular con la ITV caducada",
    categoria: "Documentación e ITV",
    articulo: "Art. 76.o LSV",
    importe: 200,
    prontoPago: 100,
    puntos: 0,
    gravedad: "Grave",
    permiteProntoPago: true,
    resumen: "Circular con el vehículo habiendo superado la fecha límite indicada en la ficha técnica y pegatina.",
    descripcion: "Circular con la inspección técnica periódica vencida supone una sanción económica de 200 € (100 € pronto pago). No conlleva retirada de puntos del carnet. Recuerda que no existe 'periodo de gracia' una vez cumplida la fecha.",
    baseLegal: "Art. 76.o de la Ley sobre Tráfico y Real Decreto 920/2017 de Inspección Técnica.",
    plazoRecuperacion: "No retira puntos.",
    comoRecurrir: "Acreditar cita previa solicitada con anterioridad a la fecha de caducidad si la estación no disponía de hueco, o baja temporal del vehículo.",
    consejos: [
      "Puedes pasar la ITV hasta 30 días naturales antes de su vencimiento sin que se modifique la fecha de la próxima inspección."
    ],
    faq: [
      {
        pregunta: "¿Pueden multarme con la ITV caducada si el coche está aparcado en la calle?",
        respuesta: "Sí. Todo vehículo matriculado y en alta administrativa tiene la obligación de mantener la ITV al día, incluso si se encuentra estacionado en vía pública."
      }
    ]
  },
  {
    id: "inf-7",
    slug: "circular-con-itv-desfavorable-o-negativa",
    titulo: "Circular con ITV desfavorable o negativa",
    categoria: "Documentación e ITV",
    articulo: "Art. 76.o / 77.ll LSV",
    importe: 500,
    prontoPago: 250,
    puntos: 0,
    gravedad: "Muy Grave",
    permiteProntoPago: true,
    resumen: "Circular tras un resultado desfavorable fuera del traslado al taller, o con ITV negativa.",
    descripcion: "Con ITV desfavorable sólo se autoriza circular para trasladar el vehículo al taller o a la estación ITV (plazo máx. 2 meses; si se circula con normalidad la multa es de 200 €). Con ITV negativa el vehículo queda inmovilizado y solo puede trasladarse en grúa; circular con ella acarrea 500 € sin reducción.",
    baseLegal: "Reglamento General de Vehículos y Ley de Seguridad Vial.",
    plazoRecuperacion: "No retira puntos.",
    comoRecurrir: "Aportar factura de taller o resguardo de traslado inmediato a subsanación.",
    consejos: [
      "Nunca conduzcas un vehículo con resultado negativo salvo en grúa autorizada."
    ],
    faq: [
      {
        pregunta: "¿Cuál es la diferencia entre ITV desfavorable y negativa?",
        respuesta: "La desfavorable presenta defectos graves y permite circular hasta el taller en 2 meses. La negativa presenta defectos muy graves que suponen riesgo inminente e impiden circular por completo."
      }
    ]
  },
  {
    id: "inf-8",
    slug: "circular-sin-seguro-obligatorio-soa",
    titulo: "Circular sin seguro obligatorio de responsabilidad civil (SOA)",
    categoria: "Documentación e ITV",
    articulo: "Art. 2 y 3 RDL 8/2004",
    importe: 1500,
    prontoPago: 750,
    puntos: 0,
    gravedad: "Muy Grave",
    permiteProntoPago: true,
    resumen: "Carecer del seguro obligatorio del automóvil o circular sin póliza vigente.",
    descripcion: "Todo vehículo a motor debe contar con póliza de seguro de responsabilidad civil en vigor. La sanción oscila entre 601 € y 3.005 € en función del tipo de vehículo y si estaba circulando (1.500 € para turismos en marcha). Además conlleva la inmovilización y depósito del vehículo en el retén municipal.",
    baseLegal: "Texto Refundido de la Ley sobre Responsabilidad Civil y Seguro en la Circulación.",
    plazoRecuperacion: "No retira puntos.",
    comoRecurrir: "Presentar certificado de la aseguradora que demuestre póliza en vigor a fecha del hecho o error en el FIVA (Fichero Informativo de Vehículos Asegurados).",
    consejos: [
      "Verifica la domiciliación bancaria para evitar devoluciones involuntarias del recibo del seguro."
    ],
    faq: [
      {
        pregunta: "¿Si el coche está guardado en garaje privado debe tener seguro?",
        respuesta: "Sí. Según jurisprudencia consolidada del Tribunal de Justicia de la UE y normativa española, mientras el vehículo no cause baja formal en la DGT, debe mantener seguro obligatorio."
      }
    ]
  },
  {
    id: "inf-9",
    slug: "llevar-detector-de-radares",
    titulo: "Llevar un dispositivo detector de radares en el vehículo",
    categoria: "Dispositivos no autorizados",
    articulo: "Art. 76.f LSV",
    importe: 500,
    prontoPago: 250,
    puntos: 3,
    gravedad: "Grave",
    permiteProntoPago: true,
    resumen: "Llevar instalado o en el vehículo un detector de radares o cinemómetros.",
    descripcion: "La Ley de Seguridad Vial sanciona no solo el uso, sino la mera presencia ('llevar en el vehículo') de mecanismos o instrumentos que detecten la proximidad de cinemómetros o radares. Sanción de 500 € y pérdida de 3 puntos. Nota: los avisadores GPS con base de datos pública son 100% legales.",
    baseLegal: "Art. 76.f de la Ley de Seguridad Vial.",
    plazoRecuperacion: "2 años sin infracciones graves.",
    comoRecurrir: "Acreditar que el aparato es un avisador GPS legal basado en bases de datos y no un receptor de ondas de radar.",
    consejos: [
      "Usa apps de navegación comunitarias (Waze, Google Maps) o avisadores GPS legales."
    ],
    faq: [
      {
        pregunta: "¿Es legal llevar Google Maps o Waze con aviso de radares?",
        respuesta: "Sí, es completamente legal porque son avisadores GPS basados en la base de datos pública de la DGT, no detectores de frecuencia activa."
      }
    ]
  },
  {
    id: "inf-10",
    slug: "utilizar-inhibidor-de-radares",
    titulo: "Utilizar o instalar inhibidores de radares en el vehículo",
    categoria: "Dispositivos no autorizados",
    articulo: "Art. 77.h LSV",
    importe: 6000,
    prontoPago: 3000,
    puntos: 6,
    gravedad: "Muy Grave",
    permiteProntoPago: false,
    resumen: "Instalar o conducir vehículos con mecanismos activos para inhibir o anular radares.",
    descripcion: "El uso de inhibidores de radares o cualquier mecanismo destinado a interferir con los sistemas de vigilancia de tráfico constituye infracción muy grave con multa de 6.000 € y 6 puntos al conductor. Para los talleres mecánicos que los instalen, la sanción llega hasta 30.000 €.",
    baseLegal: "Art. 77.h y Art. 80.1 Ley sobre Tráfico.",
    plazoRecuperacion: "2 años y cursos de recuperación.",
    comoRecurrir: "Peritaje técnico que demuestre que el dispositivo instalado no emite frecuencias interferentes.",
    consejos: [
      "Evita modificaciones electrónicas no homologadas."
    ],
    faq: [
      {
        pregunta: "¿Por qué la multa es tan elevada?",
        respuesta: "Porque atenta deliberadamente contra los sistemas de control y seguridad del Estado alterando mediciones metrológicas."
      }
    ]
  },
  {
    id: "inf-11",
    slug: "saltarse-un-semaforo-en-rojo",
    titulo: "No respetar la luz roja de un semáforo (Semáforo en rojo / Foto-rojo)",
    categoria: "Señales y Semáforos",
    articulo: "Art. 76.l LSV",
    importe: 200,
    prontoPago: 100,
    puntos: 4,
    gravedad: "Grave",
    permiteProntoPago: true,
    resumen: "Rebasar la línea de detención con fase de luz roja fija de un semáforo.",
    descripcion: "No detenerse ante una luz roja de semáforo es una infracción grave sancionada con 200 € (100 € en pronto pago) y la pérdida de 4 puntos del permiso. En sistemas 'foto-rojo', deben captarse al menos dos fotografías (antes de rebasar y tras haberlo rebasado) para ser válida.",
    baseLegal: "Art. 76.l Ley de Tráfico y Art. 146 Reglamento General de Circulación.",
    plazoRecuperacion: "2 años sin infracciones graves.",
    comoRecurrir: "Comprobar la secuencia fotográfica de los sistemas foto-rojo, tiempo reglamentario de la fase ámbar (mínimo 3 segundos) y certificado metrológico.",
    consejos: [
      "No aceleres ante la luz ámbar; prepárate para detener el vehículo con suavidad.",
      "Si pasas para permitir el paso a una ambulancia en urgencia, documenta la hora y solicita anulación."
    ],
    faq: [
      {
        pregunta: "¿Qué pasa si paso en ámbar?",
        respuesta: "La luz amarilla no intermitente obliga a detenerse igual que la luz roja, salvo que el vehículo esté tan cerca que no pueda hacerlo con suficiente seguridad."
      }
    ]
  },
  {
    id: "inf-12",
    slug: "no-respetar-senal-stop-o-ceda",
    titulo: "No respetar la señal de STOP (Detención obligatoria) o Ceda el Paso",
    categoria: "Señales y Semáforos",
    articulo: "Art. 76.l LSV",
    importe: 200,
    prontoPago: 100,
    puntos: 4,
    gravedad: "Grave",
    permiteProntoPago: true,
    resumen: "No detener por completo el vehículo ante una señal R-2 de STOP o no ceder el paso.",
    descripcion: "La señal de STOP exige la detención total y completa del vehículo ante la línea de detención o antes de la intersección. Hacer un 'ceda el paso dinámico' sin parar por completo es motivo de sanción de 200 € y 4 puntos del carnet.",
    baseLegal: "Art. 76.l Ley de Tráfico y Art. 151 Reglamento de Circulación.",
    plazoRecuperacion: "2 años sin infracciones graves.",
    comoRecurrir: "Alegar visibilidad nula que obligaba a rebasar ligeramente la línea para el segundo STOP reglamentario.",
    consejos: [
      "Inmoviliza las ruedas por completo durante al menos 2 segundos antes de reanudar la marcha."
    ],
    faq: [
      {
        pregunta: "¿Hay radares automáticos que controlan los STOP?",
        respuesta: "Sí, la DGT cuenta con cámaras de calibración de vídeo automáticas que detectan si el vehículo frena hasta velocidad cero o solo ralentiza la marcha."
      }
    ]
  },
  {
    id: "inf-13",
    slug: "conduccion-temeraria-seguridad-vial",
    titulo: "Conducción temeraria manifiesta",
    categoria: "Velocidad",
    articulo: "Art. 77.e LSV & Art. 380 CP",
    importe: 500,
    prontoPago: 250,
    puntos: 6,
    gravedad: "Muy Grave",
    permiteProntoPago: true,
    resumen: "Conducir de forma manifiestamente temeraria poniendo en concreto peligro la vida de otros.",
    descripcion: "Conducir de manera temeraria supone una multa de 500 € y la retirada de 6 puntos. Si concurre peligro concreto para la vida o la integridad física de las personas, se remite a la vía penal (Art. 380 CP), castigado con penas de prisión de 6 meses a 2 años y retirada de carnet de 1 a 6 años.",
    baseLegal: "Art. 77.e Ley de Tráfico y Art. 380 Código Penal.",
    plazoRecuperacion: "Cursos y sentencia judicial.",
    comoRecurrir: "Demostrar ausencia de peligro concreto y tipificación excesiva frente a negligencia.",
    consejos: [
      "Conduce siempre respetando las normas y adaptando la velocidad a las condiciones de la vía."
    ],
    faq: [
      {
        pregunta: "¿En qué se diferencia la conducción negligente de la temeraria?",
        respuesta: "La negligente (200 €, 0 puntos) implica falta de atención o pericia sin desprecio consciente a la norma. La temeraria implica grave desprecio y riesgo evidente."
      }
    ]
  },
  {
    id: "inf-14",
    slug: "conducir-con-auriculares-o-cascos",
    titulo: "Conducir utilizando auriculares o cascos reproductores de sonido",
    categoria: "Móvil y Distracciones",
    articulo: "Art. 76.f LSV",
    importe: 200,
    prontoPago: 100,
    puntos: 3,
    gravedad: "Grave",
    permiteProntoPago: true,
    resumen: "Llevar puestos auriculares o cascos conectados a aparatos de audio o teléfonos mientras se conduce.",
    descripcion: "Queda prohibido conducir utilizando cascos o auriculares conectados a aparatos receptores o reproductores de sonido. Infracción grave sancionada con 200 € y pérdida de 3 puntos. Aplica tanto a automóviles como motocicletas, bicicletas y vehículos de movilidad personal (VMP).",
    baseLegal: "Art. 76.f Ley de Seguridad Vial.",
    plazoRecuperacion: "2 años sin sanciones graves.",
    comoRecurrir: "Acreditar dispositivos de intercomunicación homologados en casco de moto expresamente autorizados por la DGT.",
    consejos: [
      "En moto solo están permitidos los intercomunicadores homologados integrados en el casco con fines de comunicación o navegación."
    ],
    faq: [
      {
        pregunta: "¿Están permitidos los intercomunicadores en casco de moto?",
        respuesta: "Sí, desde la reforma de 2022 están autorizados los dispositivos inalámbricos certificados en el casco con fines de comunicación o navegación, siempre que no afecten a la seguridad."
      }
    ]
  },
  {
    id: "inf-15",
    slug: "entrar-en-zona-bajas-emisiones-zbe",
    titulo: "Acceso indebido a Zonas de Bajas Emisiones (ZBE)",
    categoria: "ZBE y Medio Ambiente",
    articulo: "Art. 76.z3 LSV",
    importe: 200,
    prontoPago: 100,
    puntos: 0,
    gravedad: "Grave",
    permiteProntoPago: true,
    resumen: "Acceder o circular por una ZBE sin el distintivo ambiental DGT requerido o autorización municipal.",
    descripcion: "No respetar las restricciones de acceso, circulación y estacionamiento derivadas de la aplicación de los protocolos de contaminación y de las zonas de bajas emisiones (ZBE) en municipios de más de 50.000 habitantes es una infracción grave sancionada con 200 € (100 € en pronto pago). No resta puntos.",
    baseLegal: "Art. 76.z3 Ley de Seguridad Vial y Ley 7/2021 de Cambio Climático.",
    plazoRecuperacion: "No retira puntos.",
    comoRecurrir: "Acreditar empadronamiento, autorización temporal solicitada, vehículo histórico o error en la lectura OCR de la matrícula por cámaras del ayuntamiento.",
    consejos: [
      "Consulta siempre la ordenanza municipal específica (Madrid ZBE, Barcelona ZBE Rondas, Sevilla, etc.) antes de acceder al centro urbano."
    ],
    faq: [
      {
        pregunta: "¿Es obligatorio llevar pegado el distintivo ambiental en el parabrisas?",
        respuesta: "Para la DGT no es obligatorio llevarlo físicamente (se consulta por matrícula), pero varias ordenanzas municipales (como la de Madrid) sí lo exigen en la esquina inferior derecha del parabrisas."
      }
    ]
  },
  {
    id: "inf-16",
    slug: "no-identificar-al-conductor",
    titulo: "No identificar al conductor responsable de una infracción",
    categoria: "Documentación e ITV",
    articulo: "Art. 77.j LSV",
    importe: 600,
    prontoPago: 600,
    puntos: 0,
    gravedad: "Muy Grave",
    permiteProntoPago: false,
    resumen: "El titular no identifica debidamente al conductor tras un requerimiento de la DGT.",
    descripcion: "Si se comete una infracción que conlleva pérdida de puntos o no fue notificada en el acto y el titular del vehículo no identifica verazmente al conductor en el plazo concedido, comete infracción muy grave sancionada con el doble de la multa original (si era leve) o el triple (si era grave o muy grave, ej. 600 € a 1.800 €). No tiene descuento por pronto pago.",
    baseLegal: "Art. 77.j y Art. 80.2 Ley de Seguridad Vial.",
    plazoRecuperacion: "No retira puntos pero el coste económico se triplica.",
    comoRecurrir: "Demostrar que el vehículo había sido sustraído o identificar documentalmente al conductor con copia de contrato de alquiler o autorización.",
    consejos: [
      "Identifica siempre en plazo a través de la sede electrónica de la DGT para evitar la triplicación del importe."
    ],
    faq: [
      {
        pregunta: "¿Tiene derecho al 50% de descuento la multa por no identificar?",
        respuesta: "No. La ley prohíbe expresamente cualquier bonificación por pronto pago en la infracción por no identificación del conductor."
      }
    ]
  },
  {
    id: "inf-17",
    slug: "arrojar-objetos-a-la-via-colillas",
    titulo: "Arrojar objetos a la vía que puedan causar incendios o accidentes",
    categoria: "Seguridad y Cinturón",
    articulo: "Art. 76.u LSV",
    importe: 500,
    prontoPago: 250,
    puntos: 6,
    gravedad: "Muy Grave",
    permiteProntoPago: true,
    resumen: "Arrojar a la vía o sus inmediaciones objetos que puedan producir incendios o accidentes.",
    descripcion: "Arrojar colillas u otros objetos que puedan producir incendios o suponer peligro para la circulación está castigado con 500 € y 6 puntos del carnet desde 2022. Además puede conllevar responsabilidades penales en materia de delitos forestales.",
    baseLegal: "Art. 76.u Ley de Tráfico y Código Penal.",
    plazoRecuperacion: "2 años sin infracciones graves.",
    comoRecurrir: "Alegar falta de pruebas concluyentes en denuncias voluntarias sin fotografía o vídeo.",
    consejos: [
      "Lleva siempre un cenicero hermético portátil en el coche."
    ],
    faq: [
      {
        pregunta: "¿Aplica también si lo tira un acompañante?",
        respuesta: "La sanción económica puede dirigirse al autor o al titular si no se identifica, y la pérdida de puntos al conductor si no se prueba autoría distinta."
      }
    ]
  },
  {
    id: "inf-18",
    slug: "adelantar-ciclistas-sin-separacion",
    titulo: "Adelantar a ciclistas sin guardar la separación mínima de 1,5 metros",
    categoria: "Seguridad y Cinturón",
    articulo: "Art. 76.c LSV",
    importe: 200,
    prontoPago: 100,
    puntos: 6,
    gravedad: "Grave",
    permiteProntoPago: true,
    resumen: "Adelantar poniendo en peligro o sin cambiar de carril / respetar 1,5 metros con ciclistas.",
    descripcion: "Al adelantar a bicicletas o ciclomotores, es obligatorio ocupar completamente el carril contiguo en vías de más de un carril por sentido, o mantener al menos 1,5 metros de distancia lateral en vías de un carril. Incumplirlo resta 6 puntos y 200 €.",
    baseLegal: "Art. 76.c y Art. 35 Reglamento General de Circulación.",
    plazoRecuperacion: "2 años sin infracciones graves.",
    comoRecurrir: "Aportar telemetría o imágenes de cámara de a bordo que demuestren ocupación completa de carril.",
    consejos: [
      "Está permitido pisar y rebasar la línea continua para adelantar a ciclistas siempre que haya visibilidad y seguridad."
    ],
    faq: [
      {
        pregunta: "¿Puedo pisar la línea continua para adelantar a un ciclista?",
        respuesta: "Sí, es completamente legal y obligatorio para garantizar el metro y medio o cambio completo de carril."
      }
    ]
  },
  {
    id: "inf-19",
    slug: "estacionar-o-parar-en-carril-bus-bici",
    titulo: "Parar o estacionar en carriles reservados a bus o carril bici",
    categoria: "Señales y Semáforos",
    articulo: "Art. 76.d LSV",
    importe: 200,
    prontoPago: 100,
    puntos: 0,
    gravedad: "Grave",
    permiteProntoPago: true,
    resumen: "Inmovilizar el vehículo en carriles bus, taxi o vías ciclistas entorpeciendo el paso.",
    descripcion: "Parar o estacionar en el carril reservado para autobuses, taxis o vías ciclistas es una infracción grave que acarrea 200 € de multa y retirada con grúa al depósito municipal. No descuenta puntos.",
    baseLegal: "Art. 76.d de la Ley de Seguridad Vial.",
    plazoRecuperacion: "No retira puntos.",
    comoRecurrir: "Avería mecánica debidamente justificada con asistencia de grúa de auxilio.",
    consejos: [
      "Nunca te detengas 'solo un minuto' con los cuatro intermitentes en un carril reservado."
    ],
    faq: [
      {
        pregunta: "¿Los 4 intermitentes justifican la parada en carril bus?",
        respuesta: "No, en absoluto. El uso de las luces de emergencia no otorga derecho a invadir carriles reservados ni evita la sanción."
      }
    ]
  },
  {
    id: "inf-20",
    slug: "circular-en-sentido-contrario",
    titulo: "Circular en sentido contrario al establecido (dirección prohibida)",
    categoria: "Señales y Semáforos",
    articulo: "Art. 77.f LSV",
    importe: 500,
    prontoPago: 250,
    puntos: 6,
    gravedad: "Muy Grave",
    permiteProntoPago: true,
    resumen: "Conducir en sentido contrario por autopistas, autovías o calles urbanas.",
    descripcion: "Circular en sentido contrario en cualquier tipo de vía es una infracción muy grave con sanción de 500 € y 6 puntos. Si se realiza en autopista o de forma continuada, puede imputarse como delito de conducción temeraria del Art. 380 o 381 del Código Penal.",
    baseLegal: "Art. 77.f Ley de Seguridad Vial y Art. 380 CP.",
    plazoRecuperacion: "2 años y cursos.",
    comoRecurrir: "Acreditar señalización viaria defectuosa, tapada o confusa en la incorporación.",
    consejos: [
      "Ante la duda en una incorporación, detente en el arcén y señaliza inmediatamente."
    ],
    faq: [
      {
        pregunta: "¿Qué hacer si entro por error en sentido contrario en una autovía?",
        respuesta: "Detén el coche en el arcén de inmediato, enciende luces de emergencia, sal con chaleco por detrás del guardarraíl y llama al 112."
      }
    ]
  },
  {
    id: "inf-21",
    slug: "no-mantener-distancia-de-seguridad",
    titulo: "No guardar la distancia de seguridad con el vehículo precedente",
    categoria: "Seguridad y Cinturón",
    articulo: "Art. 76.n LSV",
    importe: 200,
    prontoPago: 100,
    puntos: 4,
    gravedad: "Grave",
    permiteProntoPago: true,
    resumen: "Circular pegado al vehículo de delante sin dejar espacio para frenar con seguridad.",
    descripcion: "Todo conductor debe mantener con el vehículo que le precede una distancia que le permita detenerse en caso de frenado brusco sin colisionar. No respetarla resta 4 puntos y 200 € de multa.",
    baseLegal: "Art. 76.n Ley de Tráfico y Art. 54 Reglamento de Circulación.",
    plazoRecuperacion: "2 años sin infracciones graves.",
    comoRecurrir: "Solicitar filmación continua del helicóptero Pegasus o dron para comprobar si hubo maniobra previa del vehículo adelantado que redujo el espacio.",
    consejos: [
      "Aplica la regla de los dos segundos en seco y tres o cuatro segundos en mojado."
    ],
    faq: [
      {
        pregunta: "¿Cómo mide la DGT la distancia de seguridad?",
        respuesta: "Mediante cámaras telemétricas desde helicópteros Pegasus, drones y vehículos camuflados equipados con cinemómetros y software de medición de tiempo."
      }
    ]
  },
  {
    id: "inf-22",
    slug: "conducir-con-permiso-caducado",
    titulo: "Conducir con el permiso o carnet de conducir caducado",
    categoria: "Documentación e ITV",
    articulo: "Art. 76.p LSV",
    importe: 200,
    prontoPago: 100,
    puntos: 0,
    gravedad: "Grave",
    permiteProntoPago: true,
    resumen: "Conducir sin haber renovado la vigencia del permiso de conducción.",
    descripcion: "Conducir con el carnet de conducir caducado acarrea una sanción de 200 € (100 € en pronto pago). No resta puntos. No es necesario volver a examinarse, solo pasar el reconocimiento psicofísico y abonar la tasa de renovación.",
    baseLegal: "Art. 76.p Ley de Tráfico y Art. 12 Reglamento General de Conductores.",
    plazoRecuperacion: "No retira puntos.",
    comoRecurrir: "Aportar justificante de renovación tramitada antes de la sanción.",
    consejos: [
      "Puedes renovar el carnet hasta 3 meses antes de que caduque sin perder días de vigencia."
    ],
    faq: [
      {
        pregunta: "¿Hay que repetir el examen de conducir si lleva años caducado?",
        respuesta: "No. En España nunca se pierde el derecho por el mero transcurso del tiempo de caducidad; solo hay que renovar el psicotécnico."
      }
    ]
  },
  {
    id: "inf-23",
    slug: "conducir-sin-puntos-o-con-perdida-de-vigencia",
    titulo: "Conducir habiendo perdido todos los puntos del carnet",
    categoria: "Documentación e ITV",
    articulo: "Art. 384 Código Penal",
    importe: 500,
    prontoPago: 250,
    puntos: 0,
    gravedad: "Delito Penal",
    permiteProntoPago: false,
    resumen: "Ponerse al volante habiendo recibido la resolución firme de pérdida de vigencia por puntos.",
    descripcion: "Conducir tras la pérdida total de los puntos legalmente asignados constituye delito penal tipificado en el artículo 384 del Código Penal. Conlleva pena de prisión de 3 a 6 meses o multa de 12 a 24 meses o trabajos comunitarios de 31 a 90 días.",
    baseLegal: "Art. 384 Código Penal y Ley de Seguridad Vial.",
    plazoRecuperacion: "Curso de recuperación total de 24 horas tras 6 meses de inhabilitación (3 meses para conductores profesionales).",
    comoRecurrir: "Comprobar posibles defectos en las notificaciones edictales de pérdida de vigencia (falta de conocimiento real de la pérdida).",
    consejos: [
      "Consulta tu saldo de puntos con frecuencia en la app miDGT."
    ],
    faq: [
      {
        pregunta: "¿Puedo conducir si he agotado los puntos pero no me ha llegado la carta de la DGT?",
        respuesta: "Hasta que la DGT no notifica formalmente la resolución de pérdida de vigencia no empieza el periodo de inhabilitación, pero debes abstenerte de cometer infracciones."
      }
    ]
  },
  {
    id: "inf-24",
    slug: "matricula-ilegible-o-manipulada",
    titulo: "Placa de matrícula ilegible, deteriorada o manipulada",
    categoria: "Documentación e ITV",
    articulo: "Art. 76.p / 77.k LSV",
    importe: 200,
    prontoPago: 100,
    puntos: 0,
    gravedad: "Grave",
    permiteProntoPago: true,
    resumen: "Circular con placas de matrícula sin visibilidad, dobladas, sucias o alteradas.",
    descripcion: "Llevar la placa desgastada, doblada o sucia de barro que impida su lectura supone 200 € de multa. Si la placa ha sido deliberadamente manipulada (sistemas retráctiles, reflectantes químicos o adhesivos para burlar radares), la sanción se eleva a 6.000 € y 6 puntos.",
    baseLegal: "Art. 76.p y Art. 77.k Ley sobre Tráfico.",
    plazoRecuperacion: "2 años en caso de manipulación (6 puntos).",
    comoRecurrir: "Factura de sustitución inmediata de placas y prueba fotográfica.",
    consejos: [
      "Reemplaza matrículas acrílicas o metálicas en cuanto comiencen a pelarse las láminas reflectantes."
    ],
    faq: [
      {
        pregunta: "¿Cuánto cuesta la multa si la matrícula está sucia por el barro de un camino?",
        respuesta: "200 € sin pérdida de puntos, salvo que el agente aprecie intencionalidad dolosa para eludir cámaras de tráfico."
      }
    ]
  },
  {
    id: "inf-25",
    slug: "no-respetar-ordenes-agentes-trafico",
    titulo: "No obedecer las órdenes o señales de los agentes de tráfico",
    categoria: "Señales y Semáforos",
    articulo: "Art. 76.b LSV",
    importe: 200,
    prontoPago: 100,
    puntos: 4,
    gravedad: "Grave",
    permiteProntoPago: true,
    resumen: "Desobedecer las órdenes, alto o indicaciones directas de Guardia Civil o Policía Local.",
    descripcion: "Las señales de los agentes de tráfico prevalecen sobre cualquier otra señal vial (semáforos, señales verticales o marcas viales). Desobedecer sus indicaciones directas conlleva sanción grave de 200 € y 4 puntos del carnet.",
    baseLegal: "Art. 76.b Ley de Seguridad Vial y Art. 143 RGC.",
    plazoRecuperacion: "2 años sin infracciones graves.",
    comoRecurrir: "Alegar falta de visibilidad del agente en condiciones climatológicas adversas o peligro para terceros en caso de frenado imprevisto.",
    consejos: [
      "Ante un control, reduce la marcha de forma progresiva y sigue las indicaciones con calma."
    ],
    faq: [
      {
        pregunta: "¿Qué señal prevalece si un semáforo está verde pero un agente manda parar?",
        respuesta: "La orden del agente siempre prevalece sobre cualquier semáforo, señal vertical o marca en el suelo."
      }
    ]
  },
  {
    id: "inf-26",
    slug: "dar-marcha-atras-en-autopista-o-autovia",
    titulo: "Maniobra de marcha atrás en autopistas o autovías",
    categoria: "Velocidad",
    articulo: "Art. 76.a LSV",
    importe: 200,
    prontoPago: 100,
    puntos: 4,
    gravedad: "Grave",
    permiteProntoPago: true,
    resumen: "Dar marcha atrás tras pasarse una salida en vías de alta velocidad.",
    descripcion: "Efectuar la maniobra de marcha atrás en autopistas y autovías está terminantemente prohibido bajo cualquier circunstancia. Conlleva 200 € y 4 puntos. Si la maniobra genera grave riesgo para los vehículos que circulan a alta velocidad, puede ser imputada como conducción temeraria con 6 puntos.",
    baseLegal: "Art. 76.a Ley sobre Tráfico y Art. 80 Reglamento de Circulación.",
    plazoRecuperacion: "2 años sin infracciones graves.",
    comoRecurrir: "Imposible de justificar salvo orden expresa de agentes por corte absoluto de vía.",
    consejos: [
      "Si te pasas una salida, continúa con tranquilidad hasta la siguiente intersección o cambio de sentido."
    ],
    faq: [
      {
        pregunta: "¿Y si solo retrocedo unos pocos metros por el arcén?",
        respuesta: "La prohibición es absoluta en la calzada y en el arcén de autopistas y autovías. Sigue conllevando 200 € y 4 puntos."
      }
    ]
  },
  {
    id: "inf-27",
    slug: "no-utilizar-alumbrado-reglamentario",
    titulo: "Circular sin el alumbrado obligatorio en túneles, noche o baja visibilidad",
    categoria: "Otras infracciones",
    articulo: "Art. 76.e LSV",
    importe: 200,
    prontoPago: 100,
    puntos: 0,
    gravedad: "Grave",
    permiteProntoPago: true,
    resumen: "Circular sin luces de cruce o posición en túneles o condiciones meteorológicas adversas.",
    descripcion: "Circular sin encender el alumbrado obligatorio entre el ocaso y la salida del sol, o a cualquier hora en túneles, pasos inferiores o con niebla/lluvia intensa, supone una sanción de 200 € (100 € en pronto pago). No descuenta puntos.",
    baseLegal: "Art. 76.e Ley de Tráfico y Arts. 99-106 RGC.",
    plazoRecuperacion: "No retira puntos.",
    comoRecurrir: "Avería repentina demostrada con factura de sustitución de lámparas.",
    consejos: [
      "Deja el mando de luces en posición 'Auto' o activa el cruce de inmediato al entrar en un túnel."
    ],
    faq: [
      {
        pregunta: "¿Bastan las luces de circulación diurna (DRL) para entrar a un túnel?",
        respuesta: "No. Las luces DRL no encienden los pilotos traseros. En túneles es obligatorio activar las luces de cruce (cortas)."
      }
    ]
  },
  {
    id: "inf-28",
    slug: "conducir-con-neumaticos-desgastados",
    titulo: "Circular con neumáticos con profundidad inferior a 1,6 mm o deformados",
    categoria: "Seguridad y Cinturón",
    articulo: "Art. 76.o LSV",
    importe: 200,
    prontoPago: 100,
    puntos: 0,
    gravedad: "Grave",
    permiteProntoPago: true,
    resumen: "Neumáticos sin dibujo mínimo legal de 1,6 mm, con alambres visibles o ampollas.",
    descripcion: "Circular con neumáticos cuya banda de rodadura tenga una profundidad inferior a 1,6 mm o presenten cortes o deformaciones es una infracción de 200 € por cada neumático afectado. Si el estado es de riesgo grave, el vehículo puede ser inmovilizado.",
    baseLegal: "Reglamento General de Vehículos y Ley de Seguridad Vial.",
    plazoRecuperacion: "No retira puntos.",
    comoRecurrir: "Informe pericial de dibujo legal y certificado de montaje reciente.",
    consejos: [
      "Usa la moneda de 1 euro: si el borde dorado queda al descubierto en las ranuras, es momento de cambiarlos."
    ],
    faq: [
      {
        pregunta: "¿La multa es por neumático o por vehículo?",
        respuesta: "La sanción es de 200 € por cada neumático en mal estado, por lo que 4 neumáticos lisos pueden suponer hasta 800 €."
      }
    ]
  }
];
