// App.jsx
import "./index.css"; // Importing CSS styles from index.css
import {
  closestCorners,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core"; // Importing DndContext and sensor utilities from @dnd-kit/core
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable"; // Importing arrayMove and sortableKeyboardCoordinates utilities from @dnd-kit/sortable
import Column from "./Column.jsx"; // Importing Column component from Column.jsx
import { useState } from "react"; // Importing useState hook from React

export default function App() {
  // Define initial column data
  const data = [
    {
      id: "Column1",
      title: "Column1",
      cards: [
        {
          id: "Card1",
          title: "Card1",
        },
        {
          id: "Card2",
          title: "Card2",
        },
      ],
    },
    {
      id: "Column2",
      title: "Column2",
      cards: [
        {
          id: "Card3",
          title: "Card3",
        },
        {
          id: "Card4",
          title: "Card4",
        },
      ],
    },
  ];
  // Define state for columns
  const [columns, setColumns] = useState(data);

  // Function to find column by unique id
  const findColumn = (unique) => {
    // If unique id is not provided, return null
    if (!unique) {
      return null;
    }

    // Check if column with unique id exists in columns array
    if (columns.some((c) => c.id === unique)) {
      return columns.find((c) => c.id === unique) ?? null;
    }

    // If not found, find the column by card's id
    const id = String(unique);
    const itemWithColumnId = columns.flatMap((c) => {
      const columnId = c.id;
      return c.cards.map((i) => ({ itemId: i.id, columnId: columnId }));
    });
    const columnId = itemWithColumnId.find((i) => i.itemId === id)?.columnId;
    return columns.find((c) => c.id === columnId) ?? null;
  };

  // Function to handle drag over event
  const handleDragOver = (event) => {
    const { active, over, delta } = event;
    const activeId = String(active.id);
    const overId = over ? String(over.id) : null;
    const activeColumn = findColumn(activeId);
    const overColumn = findColumn(overId);
    if (!activeColumn || !overColumn || activeColumn === overColumn) {
      return null;
    }
    setColumns((prevState) => {
      const activeItems = activeColumn.cards;
      const overItems = overColumn.cards;
      const activeIndex = activeItems.findIndex((i) => i.id === activeId);
      const overIndex = overItems.findIndex((i) => i.id === overId);
      const newIndex = () => {
        const putOnBelowLastItem =
          overIndex === overItems.length - 1 && delta.y > 0;
        const modifier = putOnBelowLastItem ? 1 : 0;
        return overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      };
      return prevState.map((c) => {
        if (c.id === activeColumn.id) {
          c.cards = activeItems.filter((i) => i.id !== activeId);
          return c;
        } else if (c.id === overColumn.id) {
          c.cards = [
            ...overItems.slice(0, newIndex()),
            activeItems[activeIndex],
            ...overItems.slice(newIndex(), overItems.length),
          ];
          return c;
        } else {
          return c;
        }
      });
    });
    console.log(columns);
  };

  // Function to handle drag end event
  const handleDragEnd = (event) => {
    const { active, over } = event;
    const activeId = String(active.id);
    const overId = over ? String(over.id) : null;
    const activeColumn = findColumn(activeId);
    const overColumn = findColumn(overId);
    if (!activeColumn || !overColumn || activeColumn !== overColumn) {
      return null;
    }
    const activeIndex = activeColumn.cards.findIndex((i) => i.id === activeId);
    const overIndex = overColumn.cards.findIndex((i) => i.id === overId);
    if (activeIndex !== overIndex) {
      setColumns((prevState) => {
        return prevState.map((column) => {
          if (column.id === activeColumn.id) {
            column.cards = arrayMove(overColumn.cards, activeIndex, overIndex);
            return column;
          } else {
            return column;
          }
        });
      });
      console.log(columns);
    }
  };

  // Define sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  // Render the app component
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <div
        className="App"
        style={{ display: "flex", flexDirection: "row", padding: "20px" }}
      >
        {columns.map((column) => (
          <Column
            key={column.id}
            id={column.id}
            title={column.title}
            cards={column.cards}
          ></Column>
        ))}
      </div>
    </DndContext>
  );
}
