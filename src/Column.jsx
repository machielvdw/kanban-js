// Column.jsx
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable"; // Importing SortableContext and rectSortingStrategy from @dnd-kit/sortable
import { useDroppable } from "@dnd-kit/core"; // Importing useDroppable hook from @dnd-kit/core
import Card from "./Card.jsx"; // Importing Card component from Card.jsx

const Column = ({ id, title, cards }) => {
	// Define droppable area for the column
	const { setNodeRef } = useDroppable({ id: id });
	return (
		// Define sortable context for the column
		<SortableContext id={id} items={cards} strategy={rectSortingStrategy}>
			<div
				ref={setNodeRef}
				style={{
					width: "200px",
					background: "rgba(245,247,249,1.00)",
					marginRight: "10px"
				}}
			>
				{/* Render column title */}
				<p
					style={{
						padding: "5px 20px",
						textAlign: "left",
						fontWeight: "500",
						color: "#575757"
					}}
				>
					{title}
				</p>
				{/* Render cards within the column */}
				{cards.map((card) => (
					<Card key={card.id} id={card.id} title={card.title}></Card>
				))}
			</div>
		</SortableContext>
	);
};

export default Column;
