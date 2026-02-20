import 'dotenv/config';
import { db } from '../';
import { menu } from '../schema/menu';
import { events } from '../schema';

const menus = [
	{
		name: 'Classic Dinner',
		description:
			'A timeless three-course dinner featuring a garden salad, grilled chicken with roasted vegetables, and chocolate mousse.',
	},
	{
		name: 'Mediterranean Feast',
		description:
			'Hummus, falafel, grilled lamb chops, tabbouleh, and baklava. Inspired by the flavors of the Mediterranean.',
	},
	{
		name: 'Seafood Gala',
		description:
			'Fresh oysters, shrimp cocktail, pan-seared salmon, lobster tail, and key lime pie.',
	},
	{
		name: 'BBQ Cookout',
		description:
			'Smoked brisket, pulled pork sliders, coleslaw, cornbread, baked beans, and peach cobbler.',
	},
	{
		name: 'Vegan Garden',
		description:
			'Roasted beet carpaccio, stuffed bell peppers, mushroom risotto, and a seasonal fruit tart.',
	},
	{
		name: 'Brunch Buffet',
		description:
			'Eggs benedict, avocado toast, pancakes, fresh fruit, mimosas, and artisan pastries.',
	},
	{
		name: 'Italian Banquet',
		description:
			'Bruschetta, Caesar salad, handmade pasta with Bolognese, wood-fired pizza, and tiramisu.',
	},
	{
		name: 'Asian Fusion',
		description:
			'Spring rolls, miso soup, teriyaki chicken, sushi platter, pad thai, and mochi ice cream.',
	},
];

async function main() {
	console.log('Seeding menus...');

	await db.delete(events).execute();
	await db.delete(menu).execute();

	await db
		.insert(menu)
		.values(menus)
		.onConflictDoNothing({ target: menu.name });

	console.log(`Seeded ${menus.length} menus.`);
}

main()
	.then(() => {
		console.log('Seed complete.');
		process.exit(0);
	})
	.catch((err) => {
		console.error('Seed failed:', err);
		process.exit(1);
	});
