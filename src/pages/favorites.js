import { setupLayoutEvents } from '../components/layout.js';
import { qrData } from '../utils/storage.js';
import { renderQrGrid } from './my-qrs.js';

const favoriteQrs = () => qrData.getAll().filter(qr => qr.favorite);

export const FavoritesPage = {
    afterRender: async () => {
        setupLayoutEvents();

        const renderFavorites = () => {
            renderQrGrid(favoriteQrs(), { onChange: renderFavorites });
        };

        renderFavorites();
    }
};
