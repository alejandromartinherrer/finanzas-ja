# Finanzas J&A · app móvil

Versión de consulta del panel de finanzas familiar, pensada para el teléfono.

**Aquí no hay ni un dato en claro.** El contenido —los apuntes, los importes y
hasta el propio código del panel— viaja dentro de un bloque cifrado con
AES-256-GCM. La clave se deriva de una contraseña con PBKDF2-SHA256 y 600.000
iteraciones, y el descifrado ocurre **en el teléfono**: la contraseña no se
envía a ningún servidor, no se guarda en el repositorio y no hay backend que
la valide. Sin ella, este repositorio es ruido.

Se genera desde el ordenador con `python panel.py --movil` y se publica con
`python publicar_movil.py`. Ni los Excel de origen ni el generador viven aquí.
