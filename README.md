# Places2Secours

Site vitrine pour **Places2Secours** — service de mise en relation pour des billets d'événements complets (concerts, festivals, DJ sets).

> « Le sold out n'existe plus. » On anticipe les events les plus demandés, on sécurise les places, et on connecte les clients directement via WhatsApp.

## 📄 Pages

- **`index.html`** — Landing page : présentation, fonctionnement, confiance, témoignages, FAQ.
- **`billets.html`** — Liste des billets disponibles. Clic sur un billet → pop-up avec les détails + bouton de contact WhatsApp.

## 🎨 Stack

100 % statique, sans dépendance :

- `index.html`, `billets.html`
- `css/style.css` — thème galaxie bleu-violet + liquid glass
- `js/main.js` — starfield, halo souris, tilt 3D, données billets & modal

## ➕ Ajouter un billet

Tout est centralisé dans le tableau `TICKETS` en haut de [`js/main.js`](js/main.js). Copiez le bloc existant et adaptez les champs (`artist`, `event`, `venue`, `date`, `gradient`, `emoji`, `type`…). La carte et la pop-up se génèrent automatiquement.

## 📞 Contact

Le bouton WhatsApp pointe vers le numéro configuré dans `WHATSAPP_NUMBER` (format international) en haut de [`js/main.js`](js/main.js).

## 🚀 Déploiement

Site statique → hébergeable gratuitement sur **GitHub Pages**, **Netlify** ou **Vercel**.

### GitHub Pages
1. Repo → **Settings** → **Pages**
2. Source : branche `main`, dossier `/ (root)`
3. Le site sera servi sur `https://<utilisateur>.github.io/<repo>/`

## ⚖️ Mentions

Places2Secours est un service d'intermédiation. Ce site est une vitrine de présentation et ne constitue pas une plateforme de transaction ou de revente en ligne.
