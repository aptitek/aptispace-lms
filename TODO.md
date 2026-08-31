[ ] Enforce WCAG 2.1 AA AA Level Compliance in Design System, Forms and controls
[ ] Check GDPR Compliance (ONLY once production starts and app is finished) DO NOT use cookies if possible except for github login. If cookies are needed, use localstorage instead.
[x] Make the logos on the id card holo again
[x] Backface rendering on onboarding card is broken again
[ ] Render SVG and do image processign on client side to ensure light webp R2 storage
[ ] Optimise Galaxy further
[x] Make language and mode toggle border consistent with each other and MD3
[x] Logout needs to be a icon-button with tooltip instead
[ ] Placeholder for avatar (MDI avatar)
[ ] Check Deadcode, test all features end to end
[ ] If possible catch those full screen errors inm status center
[x] Update README.md to reflect current state
[ ] In headerbar, we replace the user card with a shaped Avatar that opens the onboarding modal when clicked. Display it only once onboarding is complete.
[ ] Add admin/student/instructor badges to the idcard along with github username as a card identifier
[x] Seed the guilloche properly with school id
[x] Remove galaxy background from onboarding page to save on performance.
[ ] Remove server.hmr.overlay and catch the errors with our status center if possible instead

---

[ ] Start the card grid component using the best between deck-fx card grid or MD3 grid system
[ ] Implement a generic MD3 search and filter component for schools, cohort, group, students, activities and courses.
[ ] Make an admin section for audit and reported errors.
[ ] Setup a dashboard using the metrics from the DB / R2 / Workers to show usage statistics, errors etc.
