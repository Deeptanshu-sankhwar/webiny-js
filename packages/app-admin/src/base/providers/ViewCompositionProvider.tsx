import React, { createContext, useContext, useMemo, useState } from "react";

export interface ViewElement {
    name: string;
    elements: JSX.Element[];
    label?: string;
    [key: string]: any;
}

interface ElementSetter {
    (element: ViewElement): ViewElement;
}

export interface ViewCompositionContext {
    getViewElement(view: string, name: string): ViewElement | null;
    setViewElement(view: string, name: string, setter: ElementSetter): void;
}

const ViewCompositionContext = createContext<ViewCompositionContext>({
    getViewElement: () => {
        return null;
    },
    setViewElement: () => {
        return void 0;
    }
});
ViewCompositionContext.displayName = "ViewCompositionContext";

interface ViewCompositionProviderState {
    [key: string]: Record<string, any>;
}
const ViewCompositionProvider: React.FC = ({ children }) => {
    const [state, setState] = useState<ViewCompositionProviderState>({});

    const context = useMemo(
        () => ({
            getViewElement(view: string, name: string): ViewElement {
                return state[view] && state[view][name];
            },
            setViewElement(view: string, name: string, setter: ElementSetter) {
                setState(state => {
                    const existing = state[view] && state[view][name];
                    return {
                        ...state,
                        [view]: {
                            ...state[view],
                            [name]: setter(existing)
                        }
                    };
                });
            }
        }),
        [state]
    );

    return (
        <ViewCompositionContext.Provider value={context}>
            {children}
        </ViewCompositionContext.Provider>
    );
};

export function useViewComposition() {
    return useContext(ViewCompositionContext);
}

export const createViewCompositionProvider =
    () =>
    (Component: React.ComponentType<unknown>): React.FC => {
        return function ViewCompositionProviderHOC({ children }) {
            return (
                <ViewCompositionProvider>
                    <Component>{children}</Component>
                </ViewCompositionProvider>
            );
        };
    };
