"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cat_promos = exports.promociones_compatibles = exports.afectacion_cc = exports.cat_msi = exports.beneficio_msi = exports.beneficio_productos = exports.beneficio_desc = exports.beneficios_promocion = exports.cat_beneficios = exports.productos_condicion = exports.cat_tipo_condicion = exports.productos_excluidos = exports.entidades_obligatorias = exports.entidades_excluidas = exports.entidades_participantes = exports.cat_tipo_entidades = exports.cat_tipos_herencia = exports.promocion = void 0;
var promocion = /** @class */ (function () {
    function promocion() {
        this.id = 0; //-
        this.nombre = ""; //-
        this.fecha_hora_inicio = '01/01/1900:00:00:00'; //-
        this.fecha_hora_fin = '01/01/1900:00:00:00'; //-
        this.vigencia_indefinida = false; //-
        this.id_tipos_herencia_promo = 0; //cat_tipos_herencia //-
        this.id_cat_tipo_condicion = 0; //cat_tipo_condicion //-
        this.monto_inferior_condicion = 0; //-
        this.monto_condicion = 0; //-
        this.incluir_desc_adic = false; //-
        this.id_tipo_beneficio = 0;
        this.aplica_cc = false;
        this.entidades_participantes = []; //-
        this.entidades_excluidas = []; //-
        this.productos_condicion = []; //-
        this.productos_excluidos = []; //-
        this.beneficios_promocion = []; //-
        this.beneficio_desc = [];
        this.beneficio_productos = []; //-
        this.beneficio_msi = [];
        this.beneficio_obligatorio = false;
        this.entidades_obligatorias = [];
        this.afectacion_cc = [];
        this.promociones_compatibles = [];
    }
    return promocion;
}());
exports.promocion = promocion;
var cat_tipos_herencia = /** @class */ (function () {
    function cat_tipos_herencia() {
        this.id = 0;
        this.tipo = "";
    }
    return cat_tipos_herencia;
}());
exports.cat_tipos_herencia = cat_tipos_herencia;
var cat_tipo_entidades = /** @class */ (function () {
    function cat_tipo_entidades() {
        this.id = 0;
        this.tipo_entidad = "";
    }
    return cat_tipo_entidades;
}());
exports.cat_tipo_entidades = cat_tipo_entidades;
var entidades_participantes = /** @class */ (function () {
    function entidades_participantes() {
        this.id = 0;
        this.id_promocion = 0; //promocion
        this.id_entidad = 0;
        this.id_tipo_entidad = 0; //cat_tipo_entidades
    }
    return entidades_participantes;
}());
exports.entidades_participantes = entidades_participantes;
var entidades_excluidas = /** @class */ (function () {
    function entidades_excluidas() {
        this.id = 0;
        this.id_promocion = 0; //promocion
        this.id_entidad = 0;
        this.id_tipo_entidad = 0; //cat_tipo_entidades
    }
    return entidades_excluidas;
}());
exports.entidades_excluidas = entidades_excluidas;
var entidades_obligatorias = /** @class */ (function () {
    function entidades_obligatorias() {
        this.id = 0;
        this.id_promocion = 0; //promocion
        this.id_entidad = 0;
        this.id_tipo_entidad = 0; //cat_tipo_entidades
    }
    return entidades_obligatorias;
}());
exports.entidades_obligatorias = entidades_obligatorias;
var productos_excluidos = /** @class */ (function () {
    function productos_excluidos() {
        this.id = 0;
        this.id_promocion = 0; //promocion
        this.id_producto = 0; // productos, sublinea, linea
        this.id_tipo_categoria = 0; // 1 Línea , 2 Sublínea , 3 producto 
    }
    return productos_excluidos;
}());
exports.productos_excluidos = productos_excluidos;
var cat_tipo_condicion = /** @class */ (function () {
    function cat_tipo_condicion() {
        this.id = 0;
        this.tipo_condicion = "";
    }
    return cat_tipo_condicion;
}());
exports.cat_tipo_condicion = cat_tipo_condicion;
var productos_condicion = /** @class */ (function () {
    function productos_condicion() {
        this.id = 0;
        this.id_promocion = 0; //promocion
        this.id_producto = 0; // productos, sublinea, linea
        this.id_tipo_categoria = 0; // 1 Línea , 2 Sublínea , 3 producto 
        this.cantidad = 0;
    }
    return productos_condicion;
}());
exports.productos_condicion = productos_condicion;
var cat_beneficios = /** @class */ (function () {
    function cat_beneficios() {
        this.id = 0;
        this.beneficio = "";
    }
    return cat_beneficios;
}());
exports.cat_beneficios = cat_beneficios;
var beneficios_promocion = /** @class */ (function () {
    function beneficios_promocion() {
        this.id = 0;
        this.id_promocion = 0; //promocion
        this.id_cat_beneficios = 0; //cat_beneficios
    }
    return beneficios_promocion;
}());
exports.beneficios_promocion = beneficios_promocion;
var beneficio_desc = /** @class */ (function () {
    function beneficio_desc() {
        this.id = 0;
        this.id_promocion = 0; //promocion
        this.cantidad = 0;
        this.es_porcentaje = false;
    }
    return beneficio_desc;
}());
exports.beneficio_desc = beneficio_desc;
var beneficio_productos = /** @class */ (function () {
    function beneficio_productos() {
        this.id = 0;
        this.id_promocion = 0; //promocion
        this.id_producto = 0; //productos
        this.cantidad = 1;
    }
    return beneficio_productos;
}());
exports.beneficio_productos = beneficio_productos;
var beneficio_msi = /** @class */ (function () {
    function beneficio_msi() {
        this.id = 0;
        this.id_promocion = 0; //promocion
        this.id_cat_msi = 0; //cat_msi
    }
    return beneficio_msi;
}());
exports.beneficio_msi = beneficio_msi;
var cat_msi = /** @class */ (function () {
    function cat_msi() {
        this.id = 0;
        this.desc_msi = "";
    }
    return cat_msi;
}());
exports.cat_msi = cat_msi;
var afectacion_cc = /** @class */ (function () {
    function afectacion_cc() {
        this.id = 0;
        this.id_promocion = 0;
        this.id_condiones_comerciales_sucursal = 0;
        this.margen = 0;
    }
    return afectacion_cc;
}());
exports.afectacion_cc = afectacion_cc;
var promociones_compatibles = /** @class */ (function () {
    function promociones_compatibles() {
        this.id = 0;
        this.id_promocion = 0; //promocion
        this.id_promocion_2 = 0; //promocion
    }
    return promociones_compatibles;
}());
exports.promociones_compatibles = promociones_compatibles;
var cat_promos = /** @class */ (function () {
    function cat_promos() {
    }
    return cat_promos;
}());
exports.cat_promos = cat_promos;
//# sourceMappingURL=promocion.js.map