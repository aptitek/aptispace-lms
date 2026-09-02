[x] Make the logos on the id card holo again
[x] Backface rendering on onboarding card is broken again
[x] Render SVG and do image processign on client side to ensure light webp R2 storage
[x] Allow avatar upload even if the onboarding is not complete (error with email domain validation or not set yet)
[x] Optimise Galaxy further
[x] Make language and mode toggle border consistent with each other and MD3
[x] Logout needs to be a icon-button with tooltip instead
[x] Placeholder for avatar (MDI avatar)
[x] If possible catch those full screen errors in status center also server side reporting of "Error: No route matches URL" getInternalRouterError
[x] Update README.md to reflect current state
[x] In headerbar, we replace the user card with a shaped Avatar that opens the onboarding modal when clicked (rename that card to ProfileCard). Display it only once onboarding is complete.
[x] Add admin/student/instructor badges to the idcard along with github username as a card identifier
[x] Seed the guilloche properly with school id
[x] Remove galaxy background from onboarding page to save on performance.
[x] Remove server.hmr.overlay and catch the errors with our status center if possible instead
[ ] In status center remove the mention of REALTIME and BPM
[x] Dev impersonation should not logout to another user but normal logout

--- MANUAL TASKS ---

[x] Start the card grid component using the best between deck-fx card grid or MD3 grid system
[x] Implement a generic MD3 search and filter component for schools, cohort, group, students, activities and courses.
[ ] Make an admin section for audit and reported errors.
[ ] Setup a dashboard using the metrics from the DB / R2 / Workers to show usage statistics, errors etc.
[ ] Check Deadcode, test all features end to end
[ ] Enforce WCAG 2.1 AA AA Level Compliance in Design System, Forms and controls
[ ] Check GDPR Compliance (ONLY once production starts and app is finished) DO NOT use cookies if possible except for github login. If cookies are needed, use localstorage instead.
