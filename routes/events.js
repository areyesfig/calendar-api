/*
    Rutas de Eventos 
    host + /api/events
*/

const {Router} = require('express');
const router = Router();
const {check} = require('express-validator');
const { getEventos, crearEventos, actualizarEventos, eliminarEventos } = require('../controllers/events');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');
//custom validation
const { isDate } = require('../helpers/isDate');


//Todas tienen que pasar por validacion de token 
router.use(validarJWT);

router.get('/', getEventos);

router.post(
    '/',
    [
        check('title','El titulo debe ser obligatorio').not().isEmpty(),
        check('start','Fecha de inicio debe ser obligatorio').custom(isDate),
        check('end','Fecha de finalización debe ser obligatorio').custom(isDate),
        validarCampos
    ],crearEventos);

router.put('/:id', actualizarEventos);

router.delete('/:id', eliminarEventos);

module.exports = router;