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
[x] In status center remove the mention of REALTIME and BPM
[x] Dev impersonation should not logout to another user but normal logout
[ ] Remove ALL code that has to do with the fallback when there is no D1 connection and mock data, just show proper error in Status Center.
[ ] The status center's badge should be smaller
[ ] Refactor ESLint into more maintainable structure
[ ] Dev impersonation should not have the extra chip on the top. Add student and such should be a select role + create user and the list should use the filter bar and the list should use UserCard component.
[ ] Editable avatar doesn't use the correct shape for the edit overlay, it should be the same as the avatar
[ ] In filter bar the level/year field is excesivelly large width
[ ] LanguageSwitch and ThemeSwitch should use more of the default switch style (size, shape, borders, colors, etc...)
[ ] In UserCard the header should be less tall (reflect in the skeleton)
[ ] Make all component have a skeleton version if it is a good practice
[ ] Remove YearRangePicker. It has been replaced by NumberPicker
[ ] Make the wavy animation in Clock card on hover only
[ ] Fix ClockCard color for progress
[ ] Make the github chip optionally editable by admins in the usercard
[ ] Make an institution and cohort card component with skeleton mirroring the usercard.
[ ] Student Inspector will use the userCard component with editable github chip
[ ] Student Inspector should be renamed UserInspector and add the Cohort and Institution Inspectors as well. Make a generic Inspector using a card + fields + buttons
[ ] MapCard needs a overhaul
[ ] Find where to make a specialty editor

--- MANUAL TASKS ---

[x] Start the card grid component using the best between deck-fx card grid or MD3 grid system
[x] Implement a generic MD3 search and filter component for schools, cohort, group, students, activities and courses.
[x] Make an admin section for audit and reported errors.
[x] Setup a dashboard using the metrics from the DB / R2 / Workers to show usage statistics, errors etc.
[ ] Enforce the use of MUI's and expressive's components instead of native ones (ESLint rule)
[ ] Check Deadcode, test all features end to end
[ ] Global check of i18n
[ ] Enforce WCAG 2.1 AA AA Level Compliance in Design System, Forms and controls
[ ] Check GDPR Compliance (ONLY once production starts and app is finished) DO NOT use cookies if possible except for github login. If cookies are needed, use localstorage instead.
