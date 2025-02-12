const express = require('express');
const router= express.Router();


const controlador=require('../controlador/home.controlador')
//Menu principal
router.get('/', controlador.home)
//router.get('/menu',tieneAcceso, controller.menuPrincipal) Copiar la funcion tieneAcceso en las demas rutas
router.get('/Turno',controlador.Turno) 
router.post('/registerPost',controlador.registerPost)
router.get('/login',controlador.login)
router.post('/loginPost',controlador.loginPost)
router.post('/buscadorPost',controlador.buscadorPost)
router.get('/datosPaci',controlador.datosPaci)
router.get('/administrador/odontologia',controlador.admi)
router.get('/administrador/solicitud',controlador.soli)
router.get('/administrador/agendado',controlador.agen)
router.get('/administrador/atendido',controlador.aten)
router.put('/pacientes/:id',controlador.put)
router.put('/pacientesAten/:id',controlador.putpac)
router.get('/notificacion',controlador.Noty)





module.exports=router;