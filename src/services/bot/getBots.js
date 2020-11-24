import http from 'src/services/http';

const getBots = (payload) => http.get('/bot', {
    params: payload,
});

// const getBots = (payload) => new Promise((resolve) => {
//     const returnValue = {
//         data: [
//             {
//                 id: 1,
//                 name: 'Jarvis',
//                 description: 'Esse é o bot do Homem de Ferro.',
//                 api_token: '6e9906db-43a9-48bc-a602-d51a27902ba1',
//                 telegram_token: 'df28e93c-73d2-4996-8d75-456ba46d4439',
//                 image: 'https://image.freepik.com/vetores-gratis/robo-sorridente-fofo-chat-bot-e-sinais-de-comunicacao-ilustracao-de-personagem-de-desenho-animado-plana-moderna-isolado-no-branco-falar-bolha-bot-de-bate-papo-de-comunicacao-de-servico-de-apoio-de-voz_92289-518.jpg',
//             },
//             {
//                 id: 2,
//                 name: 'Sexta-feira',
//                 description: null,
//                 api_token: '7dc28c68-06e4-47fe-98ea-5f36d2611c04',
//                 telegram_token: 'ea7d0f73-3d58-4f59-8966-cd3f021dd6e4',
//                 image: null,
//             },
//         ],
//     };

//     console.log(payload);
//     setTimeout(resolve, 1500, returnValue);
// });

export default getBots;
