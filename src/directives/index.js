import MouseDragDirective from './mouseDrag.js'

export default {
    install(app) {
        app.directive('mouse-drag',MouseDragDirective)
    }
}