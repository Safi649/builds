import { BlockShape } from "../../types/game";

// Define all possible block shapes for the game
export const BLOCK_SHAPES: BlockShape[] = [
  // Single block
  {
    id: "single",
    cells: [[true]],
    color: "#ef4444" // red
  },
  
  // Line shapes
  {
    id: "line2",
    cells: [[true, true]],
    color: "#3b82f6" // blue
  },
  {
    id: "line3",
    cells: [[true, true, true]],
    color: "#10b981" // emerald
  },
  {
    id: "line4",
    cells: [[true, true, true, true]],
    color: "#8b5cf6" // violet
  },
  {
    id: "line5",
    cells: [[true, true, true, true, true]],
    color: "#f59e0b" // amber
  },
  
  // Vertical lines
  {
    id: "vline2",
    cells: [[true], [true]],
    color: "#06b6d4" // cyan
  },
  {
    id: "vline3",
    cells: [[true], [true], [true]],
    color: "#84cc16" // lime
  },
  {
    id: "vline4",
    cells: [[true], [true], [true], [true]],
    color: "#ec4899" // pink
  },
  {
    id: "vline5",
    cells: [[true], [true], [true], [true], [true]],
    color: "#f97316" // orange
  },
  
  // Square shapes
  {
    id: "square2x2",
    cells: [
      [true, true],
      [true, true]
    ],
    color: "#6366f1" // indigo
  },
  {
    id: "square3x3",
    cells: [
      [true, true, true],
      [true, true, true],
      [true, true, true]
    ],
    color: "#14b8a6" // teal
  },
  
  // L shapes
  {
    id: "L2",
    cells: [
      [true, false],
      [true, true]
    ],
    color: "#f43f5e" // rose
  },
  {
    id: "L3",
    cells: [
      [true, false, false],
      [true, true, true]
    ],
    color: "#a855f7" // purple
  },
  {
    id: "reverseL2",
    cells: [
      [false, true],
      [true, true]
    ],
    color: "#22c55e" // green
  },
  {
    id: "reverseL3",
    cells: [
      [false, false, true],
      [true, true, true]
    ],
    color: "#eab308" // yellow
  },
  
  // T shapes
  {
    id: "T3",
    cells: [
      [false, true, false],
      [true, true, true]
    ],
    color: "#dc2626" // red-600
  },
  {
    id: "T3_rot",
    cells: [
      [true, false],
      [true, true],
      [true, false]
    ],
    color: "#2563eb" // blue-600
  },
  
  // Corner shapes
  {
    id: "corner2x2",
    cells: [
      [true, false],
      [false, false]
    ],
    color: "#059669" // emerald-600
  },
  {
    id: "corner3x3",
    cells: [
      [true, false, false],
      [false, false, false],
      [false, false, false]
    ],
    color: "#7c3aed" // violet-600
  },
  
  // Z shapes
  {
    id: "Z",
    cells: [
      [true, true, false],
      [false, true, true]
    ],
    color: "#db2777" // pink-600
  },
  {
    id: "reverseZ",
    cells: [
      [false, true, true],
      [true, true, false]
    ],
    color: "#ea580c" // orange-600
  },
  
  // Plus shape
  {
    id: "plus",
    cells: [
      [false, true, false],
      [true, true, true],
      [false, true, false]
    ],
    color: "#0891b2" // cyan-600
  }
];

// Get random block shapes for the next pieces
export function getRandomBlockShapes(count: number = 3): BlockShape[] {
  const shapes: BlockShape[] = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * BLOCK_SHAPES.length);
    const baseShape = BLOCK_SHAPES[randomIndex];
    
    // Create a copy with unique ID
    shapes.push({
      ...baseShape,
      id: `${baseShape.id}_${Date.now()}_${i}`
    });
  }
  return shapes;
}

// Get block shapes based on level (higher levels get more complex shapes)
export function getLevelBasedBlockShapes(level: number, count: number = 3): BlockShape[] {
  let availableShapes = [...BLOCK_SHAPES];
  
  // Level 1-5: Simple shapes only
  if (level <= 5) {
    availableShapes = BLOCK_SHAPES.filter(shape => 
      shape.id.includes('single') || 
      shape.id.includes('line') || 
      shape.id.includes('square2x2')
    );
  }
  // Level 6-10: Add L shapes
  else if (level <= 10) {
    availableShapes = BLOCK_SHAPES.filter(shape => 
      !shape.id.includes('square3x3') && 
      !shape.id.includes('plus') && 
      !shape.id.includes('Z')
    );
  }
  // Level 11+: All shapes available
  
  const shapes: BlockShape[] = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * availableShapes.length);
    const baseShape = availableShapes[randomIndex];
    
    shapes.push({
      ...baseShape,
      id: `${baseShape.id}_${Date.now()}_${i}`
    });
  }
  
  return shapes;
}

// Check if a shape can be rotated (for future enhancement)
export function canRotateShape(shape: BlockShape): boolean {
  // For now, we don't support rotation, but this could be added later
  return false;
}

// Rotate a shape 90 degrees clockwise (for future enhancement)
export function rotateShape(shape: BlockShape): BlockShape {
  const rows = shape.cells.length;
  const cols = shape.cells[0].length;
  const rotated: boolean[][] = [];
  
  for (let i = 0; i < cols; i++) {
    rotated[i] = [];
    for (let j = 0; j < rows; j++) {
      rotated[i][j] = shape.cells[rows - 1 - j][i];
    }
  }
  
  return {
    ...shape,
    cells: rotated,
    id: `${shape.id}_rotated`
  };
}
