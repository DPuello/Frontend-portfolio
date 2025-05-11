export type ShapeType = "box" | "sphere" | "torus";

export interface ShapeConfig {
  id: string;
  type: ShapeType;
  position: [number, number, number];
  size: number;
  complexity?: "low" | "medium" | "high"; // Complexity level for adaptive rendering
}

// Full set of shapes - for high performance devices
export const backgroundShapes: ShapeConfig[] = [
  {
    id: "s1",
    type: "sphere",
    position: [-9, 7, -3],
    size: 0.8,
    complexity: "medium",
  },
  { id: "b1", type: "box", position: [4, 6, 4], size: 0.7, complexity: "low" },
  {
    id: "t1",
    type: "torus",
    position: [7, -3, 3],
    size: 0.6,
    complexity: "high",
  },
  {
    id: "s2",
    type: "sphere",
    position: [-3, 0, 6],
    size: 0.9,
    complexity: "medium",
  },
  { id: "b2", type: "box", position: [8, 9, 5], size: 0.5, complexity: "low" },
  {
    id: "t2",
    type: "torus",
    position: [-7, -2, 4],
    size: 0.7,
    complexity: "high",
  },
  {
    id: "s3",
    type: "sphere",
    position: [5, 5, 0],
    size: 0.6,
    complexity: "medium",
  },
  { id: "b3", type: "box", position: [3, -5, 6], size: 0.8, complexity: "low" },
  {
    id: "t3",
    type: "torus",
    position: [-9, 10, 3],
    size: 0.9,
    complexity: "high",
  },
  {
    id: "s4",
    type: "sphere",
    position: [6, 2, 4],
    size: 0.5,
    complexity: "medium",
  },
  {
    id: "b4",
    type: "box",
    position: [-4, -7, 5],
    size: 0.7,
    complexity: "low",
  },
  {
    id: "t4",
    type: "torus",
    position: [0, 5, 7],
    size: 0.6,
    complexity: "high",
  },
  {
    id: "s5",
    type: "sphere",
    position: [-8, 7, 6],
    size: 0.8,
    complexity: "medium",
  },
  { id: "b5", type: "box", position: [7, -8, 3], size: 0.5, complexity: "low" },
  {
    id: "t5",
    type: "torus",
    position: [0, -9, 4],
    size: 0.9,
    complexity: "high",
  },
  {
    id: "s6",
    type: "sphere",
    position: [-6, 11, -5],
    size: 0.6,
    complexity: "medium",
  },
  {
    id: "b6",
    type: "box",
    position: [11, 1, -7],
    size: 0.8,
    complexity: "low",
  },
  {
    id: "t6",
    type: "torus",
    position: [-10, -4, -3],
    size: 0.7,
    complexity: "high",
  },
  {
    id: "s7",
    type: "sphere",
    position: [5, -10, -6],
    size: 0.5,
    complexity: "medium",
  },
  {
    id: "b7",
    type: "box",
    position: [-7, -11, -4],
    size: 0.6,
    complexity: "low",
  },
];

// Medium performance version - fewer and simpler shapes
export const mediumPerformanceShapes: ShapeConfig[] = [
  {
    id: "s1",
    type: "sphere",
    position: [-9, 7, -3],
    size: 0.8,
    complexity: "medium",
  },
  { id: "b1", type: "box", position: [4, 6, 4], size: 0.7, complexity: "low" },
  {
    id: "s2",
    type: "sphere",
    position: [-3, 0, 6],
    size: 0.9,
    complexity: "medium",
  },
  { id: "b2", type: "box", position: [8, 9, 5], size: 0.5, complexity: "low" },
  {
    id: "s3",
    type: "sphere",
    position: [5, 5, 0],
    size: 0.6,
    complexity: "medium",
  },
  { id: "b3", type: "box", position: [3, -5, 6], size: 0.8, complexity: "low" },
  {
    id: "t3",
    type: "torus",
    position: [-9, 10, 3],
    size: 0.9,
    complexity: "medium",
  },
  {
    id: "b4",
    type: "box",
    position: [-4, -7, 5],
    size: 0.7,
    complexity: "low",
  },
];

// Low performance version - minimal shapes, only simple geometries
export const lowPerformanceShapes: ShapeConfig[] = [
  { id: "b1", type: "box", position: [4, 6, 4], size: 0.7, complexity: "low" },
  { id: "b2", type: "box", position: [8, 9, 5], size: 0.5, complexity: "low" },
  { id: "b3", type: "box", position: [3, -5, 6], size: 0.8, complexity: "low" },
  {
    id: "b4",
    type: "box",
    position: [-4, -7, 5],
    size: 0.7,
    complexity: "low",
  },
  { id: "b5", type: "box", position: [7, -8, 3], size: 0.5, complexity: "low" },
];

// Mobile-specific shapes - optimized for portrait mode and touch interaction
export const mobileShapes: ShapeConfig[] = [
  {
    id: "s1",
    type: "sphere",
    position: [-4, 11, 2],
    size: 1.0,
    complexity: "low",
  },
  { id: "b1", type: "box", position: [3, 8, 3], size: 0.9, complexity: "low" },
  {
    id: "t1",
    type: "torus",
    position: [-2, 5, 4],
    size: 0.8,
    complexity: "medium",
  },
  {
    id: "s2",
    type: "sphere",
    position: [4, 2, 2],
    size: 1.0,
    complexity: "low",
  },
  { id: "b2", type: "box", position: [0, -1, 3], size: 0.9, complexity: "low" },
  {
    id: "t2",
    type: "torus",
    position: [-3, -5, 4],
    size: 0.8,
    complexity: "medium",
  },
  {
    id: "s3",
    type: "sphere",
    position: [2, -9, 2],
    size: 1.0,
    complexity: "low",
  },
  {
    id: "b3",
    type: "box",
    position: [-2, -13, 3],
    size: 0.9,
    complexity: "low",
  },
];

// Mobile low performance shapes - minimal for weak devices
export const mobileLowPerformanceShapes: ShapeConfig[] = [
  {
    id: "s1",
    type: "sphere",
    position: [-2, 9, 3],
    size: 1.1,
    complexity: "low",
  },
  { id: "b1", type: "box", position: [2, 4, 4], size: 1.0, complexity: "low" },
  {
    id: "s2",
    type: "sphere",
    position: [-2, -1, 3],
    size: 1.1,
    complexity: "low",
  },
  { id: "b2", type: "box", position: [2, -6, 4], size: 1.0, complexity: "low" },
  {
    id: "s3",
    type: "sphere",
    position: [-2, -11, 3],
    size: 1.1,
    complexity: "low",
  },
];

// Background dots for the alternative gradient background
export const gradientBackgroundDots = [
  { id: "d1", position: [-10, 5], size: "35vw" },
  { id: "d2", position: [95, 95], size: "22vw" },
  { id: "d3", position: [-5, 90], size: "20vw" },
  { id: "d4", position: [95, 5], size: "18vw" },
  { id: "d5", position: [50, 90], size: "31vw" },
  { id: "d6", position: [10, 60], size: "29vw" },
  { id: "d7", position: [85, 85], size: "23vw" },
  { id: "d8", position: [70, 10], size: "17vw" },
  { id: "d9", position: [65, 45], size: "29.5vw" },
  { id: "d10", position: [33, 22], size: "28.5vw" },
];
