export const sameLength = (a: number[], b: number[]) => a.length === b.length;

export const addVectors = (a: number[], b: number[]) => {
  if (!sameLength(a, b)) throw new Error("Los vectores deben tener la misma dimensión.");
  return a.map((value, index) => value + b[index]);
};

export const subtractVectors = (a: number[], b: number[]) => {
  if (!sameLength(a, b)) throw new Error("Los vectores deben tener la misma dimensión.");
  return a.map((value, index) => value - b[index]);
};

export const dotProduct = (a: number[], b: number[]) => {
  if (!sameLength(a, b)) throw new Error("Los vectores deben tener la misma dimensión.");
  return a.reduce((total, value, index) => total + value * b[index], 0);
};

export const scaleVector = (vector: number[], scalar: number) => vector.map((value) => value * scalar);

export const linearCombination = (a: number[], b: number[], coefficientA: number, coefficientB: number) => {
  if (!sameLength(a, b)) throw new Error("Los vectores deben tener la misma dimensión.");
  return a.map((value, index) => coefficientA * value + coefficientB * b[index]);
};

const matrixShape = (matrix: number[][]) => ({ rows: matrix.length, columns: matrix[0]?.length ?? 0 });

const isRectangular = (matrix: number[][]) =>
  matrix.length > 0 && matrix[0].length > 0 && matrix.every((row) => row.length === matrix[0].length);

export const validateMatrix = (matrix: number[][]) => {
  if (!isRectangular(matrix)) throw new Error("La matriz debe ser rectangular y contener valores.");
};

export const addMatrices = (a: number[][], b: number[][]) => {
  validateMatrix(a);
  validateMatrix(b);
  const shapeA = matrixShape(a);
  const shapeB = matrixShape(b);
  if (shapeA.rows !== shapeB.rows || shapeA.columns !== shapeB.columns) {
    throw new Error("Las matrices deben tener las mismas dimensiones.");
  }
  return a.map((row, rowIndex) => row.map((value, columnIndex) => value + b[rowIndex][columnIndex]));
};

export const subtractMatrices = (a: number[][], b: number[][]) => {
  validateMatrix(a);
  validateMatrix(b);
  const shapeA = matrixShape(a);
  const shapeB = matrixShape(b);
  if (shapeA.rows !== shapeB.rows || shapeA.columns !== shapeB.columns) {
    throw new Error("Las matrices deben tener las mismas dimensiones.");
  }
  return a.map((row, rowIndex) => row.map((value, columnIndex) => value - b[rowIndex][columnIndex]));
};

export const scaleMatrix = (matrix: number[][], scalar: number) =>
  matrix.map((row) => row.map((value) => value * scalar));

export const transposeMatrix = (matrix: number[][]) => {
  validateMatrix(matrix);
  return matrix[0].map((_, columnIndex) => matrix.map((row) => row[columnIndex]));
};

export const multiplyMatrices = (a: number[][], b: number[][]) => {
  validateMatrix(a);
  validateMatrix(b);
  const shapeA = matrixShape(a);
  const shapeB = matrixShape(b);
  if (shapeA.columns !== shapeB.rows) {
    throw new Error("Las columnas de A deben coincidir con las filas de B.");
  }
  return a.map((row) =>
    b[0].map((_, columnIndex) =>
      row.reduce((total, value, index) => total + value * b[index][columnIndex], 0),
    ),
  );
};
