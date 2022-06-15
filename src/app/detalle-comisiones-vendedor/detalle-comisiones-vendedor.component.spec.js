"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var detalle_comisiones_vendedor_component_1 = require("./detalle-comisiones-vendedor.component");
describe('DetalleComisionesVendedorComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [detalle_comisiones_vendedor_component_1.DetalleComisionesVendedorComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(detalle_comisiones_vendedor_component_1.DetalleComisionesVendedorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=detalle-comisiones-vendedor.component.spec.js.map