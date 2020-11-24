// eslint-disable-next-line import/no-mutable-exports
let routerInstance = null;

export default ({ router }) => {
    routerInstance = router;
};

export {
    routerInstance,
};
