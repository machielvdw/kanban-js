// Card.jsx
import { CSS } from "@dnd-kit/utilities"; // Importing CSS utilities from @dnd-kit/utilities
import { useSortable } from "@dnd-kit/sortable"; // Importing useSortable hook from @dnd-kit/sortable

const Card = ({ id, title }) => {
	// Define sortable properties for the card
	const { attributes, listeners, setNodeRef, transform } = useSortable({
		id: id
	});

	// Define style based on sorting transform
	const style = {
		margin: "10px",
		opacity: 1,
		color: "#333",
		background: "white",
		padding: "10px",
		transform: CSS.Transform.toString(transform)
	};

	// Render the card component
	return (
		<div ref={setNodeRef} {...attributes} {...listeners} style={style}>
			<div id={id}>
				{/* Render card title */}
				<p>{title}</p>
			</div>
		</div>
	);
};

export default Card;
