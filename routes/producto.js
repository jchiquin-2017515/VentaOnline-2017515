const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRole, esAdminRole } = require('../middlewares/validar-roles');

const { postProducto, putProducto, deleteProducto, getProductos, getProductoPorId } = require('../controllers/producto');

const { existeProductoPorId } = require('../helpers/db-validators');

const router = Router();

router.get('/', getProductos );

router.get('/:id', [
    check('id', 'No es un id de Mongo Válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
],  getProductoPorId);

router.post('/agregar', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], postProducto);

router.put('/editar/:id', [
    validarJWT,
    check('id', 'No es un id de Mongo Válido').isMongoId(),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], putProducto);

router.delete('/eliminar/:id', [
    validarJWT,
    esAdminRole,
    //tieneRole('ADMIN_ROLE', 'SUPER_ROLE'),
    check('id', 'No es un id de Mongo Válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], deleteProducto);



module.exports = router;