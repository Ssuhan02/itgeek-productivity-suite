// Top-level barrel for all static assets. Import assets through here (or a more
// specific barrel like `./images/backgrounds`) rather than reaching into a
// subfolder's individual files — keeps call sites stable if the folder layout
// underneath ever changes.
export * from './images/backgrounds'

// Reserved for when these folders gain real content:
// export * from './images/icons'
// export * from './images/logos'
// export * from './images/illustrations'
