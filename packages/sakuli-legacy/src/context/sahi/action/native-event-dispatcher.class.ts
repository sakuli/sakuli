import { WebElement } from "selenium-webdriver";

export class NativeEventDispatcher {

    constructor(readonly element: WebElement) {}

    private async dispatchEvent(eventCtorName: string, eventName: string, eventInit: EventInit) {
        if(!this.element){
            throw Error("Could not dispatch native event due to null or undefined WebElement reference");
        }

        await this.element.getDriver().executeScript(`
        const e = arguments[0];
        const eventName = arguments[1];
        const eventInit = arguments[2];
        const event = new ${eventCtorName}(eventName, eventInit);
        e.dispatchEvent(event);
    `, this.element, eventName, eventInit)
    }

    async dispatchAnimationEvent(name: string, init: AnimationEventInit) {
        return this.dispatchEvent('AnimationEvent', name, init)
    }
    async dispatchAudioProcessingEvent(name: string, init: AudioProcessingEventInit) {
        return this.dispatchEvent('AudioProcessingEvent', name, init)
    }

    async dispatchClipboardEvent(name: string, init: ClipboardEventInit) {
        return this.dispatchEvent('ClipboardEvent', name, init)
    }
    async dispatchCloseEvent(name: string, init: CloseEventInit) {
        return this.dispatchEvent('CloseEvent', name, init)
    }
    async dispatchCompositionEvent(name: string, init: CompositionEventInit) {
        return this.dispatchEvent('CompositionEvent', name, init)
    }

    async dispatchCustomEvent(name: string, init: CustomEventInit) {
        return this.dispatchEvent('CustomEvent', name, init)
    }
    async dispatchDeviceLightEvent(name: string, init: DeviceLightEventInit) {
        return this.dispatchEvent('DeviceLightEvent', name, init)
    }
    async dispatchDeviceMotionEvent(name: string, init: DeviceMotionEventInit) {
        return this.dispatchEvent('DeviceMotionEvent', name, init)
    }
    async dispatchDeviceOrientationEvent(name: string, init: DeviceOrientationEventInit) {
        return this.dispatchEvent('DeviceOrientationEvent', name, init)
    }

    async dispatchDragEvent(name: string, init: DragEventInit) {
        return this.dispatchEvent('DragEvent', name, init)
    }

    async dispatchErrorEvent(name: string, init: ErrorEventInit) {
        return this.dispatchEvent('ErrorEvent', name, init)
    }

    async dispatchFocusEvent(name: string, init: FocusEventInit) {
        return this.dispatchEvent('FocusEvent', name, init)
    }
    async dispatchGamepadEvent(name: string, init: GamepadEventInit) {
        return this.dispatchEvent('GamepadEvent', name, init)
    }
    async dispatchHashChangeEvent(name: string, init: HashChangeEventInit) {
        return this.dispatchEvent('HashChangeEvent', name, init)
    }
    async dispatchIDBVersionChangeEvent(name: string, init: IDBVersionChangeEventInit) {
        return this.dispatchEvent('IDBVersionChangeEvent', name, init)
    }

    async dispatchKeyboardEvent(name: string, init: KeyboardEventInit) {
        return this.dispatchEvent('KeyboardEvent', name, init)
    }
    async dispatchMediaStreamEvent(name: string, init: MediaStreamEventInit) {
        return this.dispatchEvent('MediaStreamEvent', name, init)
    }
    async dispatchMessageEvent(name: string, init: MessageEventInit) {
        return this.dispatchEvent('MessageEvent', name, init)
    }
    async dispatchMouseEvent(name: string, init: MouseEventInit) {
        return this.dispatchEvent('MouseEvent', name, init)
    }

    async dispatchOfflineAudioCompletionEvent(name: string, init: OfflineAudioCompletionEventInit) {
        return this.dispatchEvent('OfflineAudioCompletionEvent', name, init)
    }

    async dispatchPaymentRequestUpdateEvent(name: string, init: PaymentRequestUpdateEventInit) {
        return this.dispatchEvent('PaymentRequestUpdateEvent', name, init)
    }
    async dispatchPointerEvent(name: string, init: PointerEventInit) {
        return this.dispatchEvent('PointerEvent', name, init)
    }
    async dispatchPopStateEvent(name: string, init: PopStateEventInit) {
        return this.dispatchEvent('PopStateEvent', name, init)
    }
    async dispatchProgressEvent(name: string, init: ProgressEventInit) {
        return this.dispatchEvent('ProgressEvent', name, init)
    }

    async dispatchRTCDataChannelEvent(name: string, init: RTCDataChannelEventInit) {
        return this.dispatchEvent('RTCDataChannelEvent', name, init)
    }

    async dispatchRTCPeerConnectionIceEvent(name: string, init: RTCPeerConnectionIceEventInit) {
        return this.dispatchEvent('RTCPeerConnectionIceEvent', name, init)
    }

    async dispatchStorageEvent(name: string, init: StorageEventInit) {
        return this.dispatchEvent('StorageEvent', name, init)
    }

    async dispatchTouchEvent(name: string, init: TouchEventInit) {
        return this.dispatchEvent('TouchEvent', name, init)
    }
    async dispatchTrackEvent(name: string, init: TrackEventInit) {
        return this.dispatchEvent('TrackEvent', name, init)
    }
    async dispatchTransitionEvent(name: string, init: TransitionEventInit) {
        return this.dispatchEvent('TransitionEvent', name, init)
    }
    async dispatchUIEvent(name: string, init: UIEventInit) {
        return this.dispatchEvent('UIEvent', name, init)
    }

    async dispatchWebGLContextEvent(name: string, init: WebGLContextEventInit) {
        return this.dispatchEvent('WebGLContextEvent', name, init)
    }
    async dispatchWheelEvent(name: string, init: WheelEventInit) {
        return this.dispatchEvent('WheelEvent', name, init)
    }
}