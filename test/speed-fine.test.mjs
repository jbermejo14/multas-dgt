import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  calculateSpeedFine,
  calculateCorrectedSpeed,
  getPenalThreshold,
  SPEED_FINE_TABLE,
} from "../src/lib/speedFine.ts";

describe("Cálculo de Sanciones por Velocidad (Anexo IV RDL 6/2015)", () => {
  const allLimits = [20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120];

  test("La tabla contiene todos los 11 límites oficiales de la DGT", () => {
    for (const limit of allLimits) {
      assert.ok(SPEED_FINE_TABLE[limit], `Límite ${limit} no encontrado en tabla`);
      assert.equal(
        SPEED_FINE_TABLE[limit].length,
        5,
        `El límite ${limit} debe tener exactamente 5 tramos`
      );
    }
  });

  test("Tramo 1 (Leve): 100 € y 0 puntos en todos los límites", () => {
    for (const limit of allLimits) {
      const bracket1 = SPEED_FINE_TABLE[limit][0];
      assert.equal(bracket1.importe, 100);
      assert.equal(bracket1.puntos, 0);
      assert.equal(bracket1.gravedad, "Leve");

      // Test with calculateSpeedFine (no margin applied to test raw bracket)
      const res = calculateSpeedFine(limit, bracket1.min, false);
      assert.equal(res.importe, 100);
      assert.equal(res.prontoPago, 50);
      assert.equal(res.puntos, 0);
      assert.equal(res.gravedad, "Leve");
    }
  });

  test("Tramo 2 (Grave): 300 € y 2 puntos", () => {
    for (const limit of allLimits) {
      const bracket2 = SPEED_FINE_TABLE[limit][1];
      assert.equal(bracket2.importe, 300);
      assert.equal(bracket2.puntos, 2);
      assert.equal(bracket2.gravedad, "Grave");

      const res = calculateSpeedFine(limit, bracket2.min, false);
      assert.equal(res.importe, 300);
      assert.equal(res.prontoPago, 150);
      assert.equal(res.puntos, 2);
    }
  });

  test("Tramo 3 (Grave): 400 € y 4 puntos", () => {
    for (const limit of allLimits) {
      const bracket3 = SPEED_FINE_TABLE[limit][2];
      assert.equal(bracket3.importe, 400);
      assert.equal(bracket3.puntos, 4);
      assert.equal(bracket3.gravedad, "Grave");

      const res = calculateSpeedFine(limit, bracket3.min, false);
      assert.equal(res.importe, 400);
      assert.equal(res.prontoPago, 200);
      assert.equal(res.puntos, 4);
    }
  });

  test("Tramo 4 (Grave): 500 € y 6 puntos", () => {
    for (const limit of allLimits) {
      const bracket4 = SPEED_FINE_TABLE[limit][3];
      assert.equal(bracket4.importe, 500);
      assert.equal(bracket4.puntos, 6);
      assert.equal(bracket4.gravedad, "Grave");

      const res = calculateSpeedFine(limit, bracket4.min, false);
      assert.equal(res.importe, 500);
      assert.equal(res.prontoPago, 250);
      assert.equal(res.puntos, 6);
    }
  });

  test("Tramo 5 (Muy Grave): 600 € y 6 puntos", () => {
    for (const limit of allLimits) {
      const bracket5 = SPEED_FINE_TABLE[limit][4];
      assert.equal(bracket5.importe, 600);
      assert.equal(bracket5.puntos, 6);
      assert.equal(bracket5.gravedad, "Muy Grave");

      const res = calculateSpeedFine(limit, bracket5.min, false);
      assert.equal(res.importe, 600);
      assert.equal(res.prontoPago, 300);
      assert.equal(res.puntos, 6);
    }
  });
});

describe("Márgenes Metrológicos de Radar (Orden ICT/155/2020)", () => {
  test("Radar Fijo: resta 3 km/h a velocidades <= 100 km/h", () => {
    assert.equal(calculateCorrectedSpeed(50, "fijo"), 47);
    assert.equal(calculateCorrectedSpeed(70, "fijo"), 67);
    assert.equal(calculateCorrectedSpeed(100, "fijo"), 97);
  });

  test("Radar Fijo: resta 3% a velocidades > 100 km/h", () => {
    // 120 * 0.97 = 116.4 -> 116
    assert.equal(calculateCorrectedSpeed(120, "fijo"), 116);
    // 130 * 0.97 = 126.1 -> 126
    assert.equal(calculateCorrectedSpeed(130, "fijo"), 126);
    // 150 * 0.97 = 145.5 -> 146
    assert.equal(calculateCorrectedSpeed(150, "fijo"), 146);
  });

  test("Radar Móvil: resta 5 km/h a velocidades <= 100 km/h", () => {
    assert.equal(calculateCorrectedSpeed(50, "movil"), 45);
    assert.equal(calculateCorrectedSpeed(80, "movil"), 75);
    assert.equal(calculateCorrectedSpeed(100, "movil"), 95);
  });

  test("Radar Móvil: resta 5% a velocidades > 100 km/h", () => {
    // 120 * 0.95 = 114
    assert.equal(calculateCorrectedSpeed(120, "movil"), 114);
    // 140 * 0.95 = 133
    assert.equal(calculateCorrectedSpeed(140, "movil"), 133);
  });

  test("Sin margen: velocidad inalterada", () => {
    assert.equal(calculateCorrectedSpeed(90, "ninguno"), 90);
    assert.equal(calculateCorrectedSpeed(135, "ninguno"), 135);
  });
});

describe("Umbrales de Delito contra la Seguridad Vial (Art. 379.1 Código Penal)", () => {
  test("Vía urbana (límite <= 50 km/h): delito al superar en > 60 km/h", () => {
    // Límite 30 -> umbral 90 km/h
    assert.equal(getPenalThreshold(30), 90);
    // Límite 50 -> umbral 110 km/h
    assert.equal(getPenalThreshold(50), 110);

    // Conduciendo a 110 en zona 50 -> NO es delito aún (debe superar los 60 km/h)
    const at110 = calculateSpeedFine(50, 110, false);
    assert.equal(at110.esDelitoPenal, false);

    // Conduciendo a 111 en zona 50 -> Delito penal
    const at111 = calculateSpeedFine(50, 111, false);
    assert.equal(at111.esDelitoPenal, true);
    assert.equal(at111.gravedad, "Delito Penal");
  });

  test("Vía interurbana (límite > 50 km/h): delito al superar en > 80 km/h", () => {
    // Límite 90 -> umbral 170 km/h
    assert.equal(getPenalThreshold(90), 170);
    // Límite 120 -> umbral 200 km/h
    assert.equal(getPenalThreshold(120), 200);

    // Conduciendo a 200 en autovía 120 -> NO es delito aún
    const at200 = calculateSpeedFine(120, 200, false);
    assert.equal(at200.esDelitoPenal, false);

    // Conduciendo a 201 en autovía 120 -> Delito penal
    const at201 = calculateSpeedFine(120, 201, false);
    assert.equal(at201.esDelitoPenal, true);
    assert.equal(at201.gravedad, "Delito Penal");
  });
});
