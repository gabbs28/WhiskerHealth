import { GridLoader } from 'react-spinners';
import type { ComponentProps } from 'react';

type LoaderProps = ComponentProps<typeof GridLoader>;

export function Loader(props: Readonly<Partial<LoaderProps>>) {
    return <GridLoader color="#3498db" {...props} />;
}
