<template>
    <div
        id="graphContainer"
        class="flex flex-center q-mb-xl"
    />
</template>

<script>
import utils from 'src/utils';

export default {
    props: {
        data: {
            type: Object,
            default: () => {},
        },
    },

    data() {
        return {
            canvas: null,
            selectedNode: null,
        };
    },

    mounted() {
        const {
            mxGraph,
            mxConstants,
            mxCompactTreeLayout,
            mxEdgeStyle,
            mxEvent,
            mxPoint,
            mxGraphView,
        } = this.$mxgraph;

        this.MxGraph = mxGraph;
        this.MxConstants = mxConstants;
        this.MxCompactTreeLayout = mxCompactTreeLayout;
        this.MxEdgeStyle = mxEdgeStyle;
        this.MxEvent = mxEvent;
        this.MxPoint = mxPoint;
        this.MxGraphView = mxGraphView;

        this.setDefaultConstants();

        this.canvas = new this.MxGraph(
            document.getElementById('graphContainer'),
        );

        this.canvas.keepEdgesInBackground = true;
        this.canvas.setPanning(true);
        this.canvas.panningHandler.useLeftButtonForPanning = true;
        this.canvas.panningHandler.useGrid = true;

        this.setNodeAndEdgeStyles();

        // this.MxEvent.addGestureListeners(
        //     this.canvas.container,
        //     this.handleClickOrTouch,
        // );

        this.canvas.addListener(this.MxEvent.CLICK, this.handleClickOrTouch);
        this.MxEvent.addMouseWheelListener(this.handleZoom);

        this.initGraph();
    },

    watch: {
        selectedNode() {
            //
        },
    },

    methods: {
        initGraph() {
            const parent = this.canvas.getDefaultParent();

            this.canvas.getModel().beginUpdate();

            try {
                const nodes = {};
                const layout = new this.MxCompactTreeLayout(this.canvas, false);

                layout.useBoundingBox = false;
                layout.edgeRouting = false;
                layout.levelDistance = 50;
                layout.nodeDistance = 4;

                Object.keys(this.data).forEach((key) => {
                    nodes[key] = this.canvas.insertVertex(
                        parent,
                        key,
                        utils.truncateText(
                            utils.wordWrap(
                                this.data[key].message,
                                30,
                            ),
                            100,
                        ),
                        150,
                        45,
                        178,
                        95,
                    );
                });

                Object.keys(this.data).forEach((key) => {
                    if (this.data[key].parent) {
                        this.canvas.insertEdge(
                            parent,
                            null,
                            '',
                            nodes[this.data[key].parent],
                            nodes[key],
                            'fillColor=white;wordWrap=breakWord;',
                        );
                    }
                });

                layout.groupPadding = 24;

                layout.execute(parent);
                this.canvas.center(true, false, 0.05, 0.5);
                this.canvas.setCellsMovable(false);
                this.canvas.setCellsResizable(false);
            } finally {
                this.canvas.getModel().endUpdate();
            }
        },

        getNodeLevel(key) {
            let levelCount = 0;

            let atualNode = this.data[key];
            while (atualNode.parent) {
                atualNode = this.data[atualNode.parent];
                levelCount += 1;
            }

            return levelCount;
        },

        handleClickOrTouch(send, evt) {
            const cell = evt.getProperty('cell');

            if (cell) {
                if (cell.edge) {
                    this.canvas.getSelectionModel().removeCell(cell);
                } else {
                    this.selectedNode = cell;
                }
            } else {
                this.canvas.getSelectionModel().removeCell(this.selectedNode);
                this.selectedNode = null;
            }

            evt.consume();
        },

        handleZoom(evt, up) {
            if (up) {
                this.canvas.zoomIn();
            } else {
                this.canvas.zoomOut();
            }

            this.MxEvent.consume(evt);
        },

        setDefaultConstants() {
            this.MxConstants.VERTEX_SELECTION_COLOR = '#1a237e';
            this.MxConstants.VERTEX_SELECTION_STROKEWIDTH = 3;
            this.MxConstants.VERTEX_SELECTION_DASHED = false;
        },

        setNodeAndEdgeStyles() {
            let style = this.canvas.getStylesheet().getDefaultVertexStyle();

            style[this.MxConstants.STYLE_SHAPE] = 'treenode';
            style[this.MxConstants.STYLE_GRADIENTCOLOR] = 'white';
            style[this.MxConstants.STYLE_OVERFLOW] = 'hidden';

            style = this.canvas.getStylesheet().getDefaultEdgeStyle();
            style[this.MxConstants.STYLE_EDGE] = this.MxEdgeStyle.TopToBottom;
            style[this.MxConstants.STYLE_ROUNDED] = true;
        },
    },
};
</script>

<style lang="scss" scoped>
</style>
