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
[x] Remove ALL code that has to do with the fallback when there is no D1 connection and mock data, just show proper error in Status Center.
[x] The status center's badge should be smaller
[ ] Refactor ESLint into more maintainable structure
[x] Dev impersonation should not have the extra chip on the top. Add student and such should be a select role + create user and the list should use the filter bar and the list should use UserCard component.
[x] Editable avatar doesn't use the correct shape for the edit overlay, it should be the same as the avatar
[x] In filter bar the level/year field is excesivelly large width
[ ] LanguageSwitch and ThemeSwitch should use more of the default switch style (size, shape, borders, colors, etc...)
[x] In UserCard the header should be less tall (reflect in the skeleton)
[ ] Make all component have a skeleton version if it is a good practice
[x] Remove YearRangePicker. It has been replaced by NumberPicker
[x] Make the wavy animation in Clock card on hover only
[x] Fix ClockCard color for progress
[x] Make the github chip optionally editable by admins in the usercard
[ ] Make an institution and cohort card component with skeleton mirroring the usercard.
[x] Student Inspector will use the userCard component with editable github chip
[x] Student Inspector should be renamed UserInspector and add the Cohort and Institution Inspectors as well. Make a generic Inspector using a card + fields + buttons
[ ] MapCard needs a overhaul
[ ] Find where to make a specialty editor
[ ] Rename EditableAvatar to ImageUpload
[ ] HoldButton expressive shapes do not display progress
[ ] Switch uses bad color for the circle when off
[ ] Rename ExpressiveCard to Card
[ ] Rename GhostActionButton to FloatingActionButton
[ ] MaterialSymbol renamed to Icon and fix the props like weight fill, etc
[ ] CalendarCard uses out of theme color for the title in Past Event
[ ] Sidebar needs to not display background and logo in auth mode (renamed ghost variant)
[ ] In InstitutionInspector the emailconfiguration should use a card as container instead of a pill shaped container.
[ ] In InstitutionInspector the emailConfiguration needs to use tabs with animations instead of buttons.
[ ] In User inspector, the cohort assignement needs to hapen on selection, no need for add button
[ ] MissionCenter main table needs to be in a card not a pill
[ ] Better contrast in devImpersonator for new account text

--- MANUAL TASKS ---

[x] Start the card grid component using the best between deck-fx card grid or MD3 grid system
[x] Implement a generic MD3 search and filter component for schools, cohort, group, students, activities and courses.
[x] Make an admin section for audit and reported errors.
[x] Setup a dashboard using the metrics from the DB / R2 / Workers to show usage statistics, errors etc.
[x] Enforce the use of MUI's and expressive's components instead of native ones (ESLint rule)
[x] Check Deadcode, test all features end to end
[x] Global check of i18n
[x] Enforce WCAG 2.1 AA AA Level Compliance in Design System, Forms and controls
[x] Check GDPR Compliance (ONLY once production starts and app is finished) DO NOT use cookies if possible except for github login. If cookies are needed, use localstorage instead.
[ ] Allow for delete account somewhere for users with holdbutton and confirm modal
