# type-test

## TODO

- [x] Fix onboarding username as "Anonymous" since usernames are unique now
- [x] Figure out changes to schema for profile stats
- [x] Make it so themes change when selected (requires refresh rn?)
- [] add xp system?
- [] Profile page with stats

## XP System

- Flat growth
- XP_PER_LEVEL = 100
- XP_NEEDED_FOR_LEVEL_UP = (current_level - 1) * XP_PER_LEVEL
- current_level = total_xp_gained/XP_PER_LEVEL + 1
## Notes

- CONSOLIDATE types/interfaces
- Add error handling to db fail?
- look into better error handling for actions/queries
- SEO stuff, opengraph, etc...
