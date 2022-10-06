export function shallowClone<T extends Object>(source: T): T {
    let destination  = Object.create(Object.getPrototypeOf(source));
    Object.assign(destination, source);
    console.log('shallowClone', source, destination)
    return destination;
}

