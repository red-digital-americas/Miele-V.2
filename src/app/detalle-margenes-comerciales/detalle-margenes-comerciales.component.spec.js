"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var detalle_margenes_comerciales_component_1 = require("./detalle-margenes-comerciales.component");
describe('DetalleMargenesComercialesComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [detalle_margenes_comerciales_component_1.DetalleMargenesComercialesComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(detalle_margenes_comerciales_component_1.DetalleMargenesComercialesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=detalle-margenes-comerciales.component.spec.js.map