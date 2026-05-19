# Civic & Nonprofit Platform - Complete API Documentation

## Table of Contents
1. [Authentication](#authentication)
2. [Nonprofits](#nonprofits)
3. [Campaigns](#campaigns)
4. [Donations](#donations)
5. [Volunteering](#volunteering)
6. [Events](#events)
7. [Petitions](#petitions)
8. [Impact Tracking](#impact-tracking)
9. [Forums](#forums)
10. [Communications](#communications)
11. [Analytics](#analytics)
12. [Admin](#admin)

---

## Authentication

### POST /auth/register
Register new user account
- **Body**: `{ email, password, firstName, lastName, role }`
- **Response**: User object with tokens
- **Status**: 201 Created

### POST /auth/login
Login with credentials
- **Body**: `{ email, password }`
- **Response**: `{ user, accessToken, refreshToken }`
- **Status**: 200 OK

### POST /auth/verify-email
Verify email address
- **Body**: `{ token }`
- **Response**: Success message
- **Status**: 200 OK

### POST /auth/forgot-password
Request password reset
- **Body**: `{ email }`
- **Response**: Success message
- **Status**: 200 OK

### POST /auth/reset-password
Reset password with token
- **Body**: `{ token, newPassword }`
- **Response**: Success message
- **Status**: 200 OK

### POST /auth/refresh
Refresh access token
- **Body**: `{ refreshToken }`
- **Response**: New access token
- **Status**: 200 OK

### GET /auth/profile
Get current user profile (Protected)
- **Headers**: `Authorization: Bearer {token}`
- **Response**: User profile object
- **Status**: 200 OK

### PATCH /auth/profile
Update user profile (Protected)
- **Headers**: `Authorization: Bearer {token}`
- **Body**: Profile fields to update
- **Response**: Updated profile
- **Status**: 200 OK

---

## Nonprofits

### POST /nonprofits
Create nonprofit organization (Protected)
- **Headers**: `Authorization: Bearer {token}`
- **Body**: `{ name, description, mission, category, contactEmail, website }`
- **Response**: Created nonprofit
- **Status**: 201 Created

### GET /nonprofits
List all nonprofits
- **Query**: `?verified=true&type=CHARITY&search=education`
- **Response**: Array of nonprofits
- **Status**: 200 OK

### GET /nonprofits/:id
Get nonprofit details
- **Params**: Nonprofit ID
- **Response**: Nonprofit with campaigns, events, reviews
- **Status**: 200 OK

### PUT /nonprofits/:id
Update nonprofit (Protected, Admin only)
- **Headers**: `Authorization: Bearer {token}`
- **Params**: Nonprofit ID
- **Body**: Fields to update
- **Response**: Updated nonprofit
- **Status**: 200 OK

### DELETE /nonprofits/:id
Delete nonprofit (Protected, Admin only)
- **Headers**: `Authorization: Bearer {token}`
- **Params**: Nonprofit ID
- **Response**: Success message
- **Status**: 200 OK

### POST /nonprofits/:id/verify
Request 501(c)(3) verification (Protected)
- **Headers**: `Authorization: Bearer {token}`
- **Body**: `{ taxExemptDocument }`
- **Response**: Verification request status
- **Status**: 200 OK

### POST /nonprofits/:id/team-members
Add team member (Protected)
- **Headers**: `Authorization: Bearer {token}`
- **Body**: `{ userId, role, permissions }`
- **Response**: Team member record
- **Status**: 201 Created

### GET /nonprofits/:id/campaigns
List nonprofit campaigns
- **Params**: Nonprofit ID
- **Response**: Array of campaigns
- **Status**: 200 OK

### GET /nonprofits/:id/events
List nonprofit events
- **Params**: Nonprofit ID
- **Response**: Array of events
- **Status**: 200 OK

### POST /nonprofits/:id/reviews
Add review (Protected)
- **Headers**: `Authorization: Bearer {token}`
- **Body**: `{ rating, comment }`
- **Response**: Review record
- **Status**: 201 Created

---

## Campaigns

### POST /campaigns
Create campaign (Protected)
- **Headers**: `Authorization: Bearer {token}`
- **Body**: `{ nonprofitId, title, description, goalAmount, category, startDate, endDate }`
- **Response**: Created campaign
- **Status**: 201 Created

### GET /campaigns
List all campaigns
- **Query**: `?status=ACTIVE&category=EDUCATION&featured=true&search=school`
- **Response**: Array of campaigns
- **Status**: 200 OK

### GET /campaigns/trending
Get trending campaigns
- **Response**: Top 10 trending campaigns
- **Status**: 200 OK

### GET /campaigns/:id
Get campaign details
- **Params**: Campaign ID
- **Response**: Campaign with milestones, updates, donations
- **Status**: 200 OK

### PUT /campaigns/:id
Update campaign (Protected, Admin only)
- **Headers**: `Authorization: Bearer {token}`
- **Body**: Fields to update
- **Response**: Updated campaign
- **Status**: 200 OK

### POST /campaigns/:id/milestones
Add campaign milestone (Protected)
- **Headers**: `Authorization: Bearer {token}`
- **Body**: `{ title, amount, description }`
- **Response**: Milestone record
- **Status**: 201 Created

### POST /campaigns/:id/updates
Add campaign update (Protected)
- **Headers**: `Authorization: Bearer {token}`
- **Body**: `{ title, content, images }`
- **Response**: Update record
- **Status**: 201 Created

---

## Donations

### POST /donations/one-time
Create one-time donation
- **Body**: `{ nonprofitId, campaignId?, amount, currency, paymentMethod }`
- **Response**: `{ donation, clientSecret }` for Stripe
- **Status**: 201 Created

### POST /donations/recurring
Create recurring donation (Protected)
- **Headers**: `Authorization: Bearer {token}`
- **Body**: `{ nonprofitId, amount, frequency, paymentMethod }`
- **Response**: Recurring donation record
- **Status**: 201 Created

### POST /donations/complete/:paymentIntentId
Complete donation after payment
- **Params**: Stripe payment intent ID
- **Response**: Completed donation
- **Status**: 200 OK

### GET /donations/my-donations
Get my donations (Protected)
- **Headers**: `Authorization: Bearer {token}`
- **Response**: Array of donations
- **Status**: 200 OK

### GET /donations/my-recurring
Get my recurring donations (Protected)
- **Headers**: `Authorization: Bearer {token}`
- **Response**: Array of recurring donations
- **Status**: 200 OK

### PATCH /donations/recurring/:id/cancel
Cancel recurring donation (Protected)
- **Headers**: `Authorization: Bearer {token}`
- **Response**: Cancelled subscription
- **Status**: 200 OK

### GET /donations/receipt/:id
Get donation tax receipt (Protected)
- **Headers**: `Authorization: Bearer {token}`
- **Response**: Receipt PDF
- **Status**: 200 OK

---

## Volunteering

### POST /volunteering/profile
Create/update volunteer profile (Protected)
- **Headers**: `Authorization: Bearer {token}`
- **Body**: `{ bio, skills, availability, interests }`
- **Response**: Volunteer profile
- **Status**: 200 OK

### POST /volunteering/opportunities
Create volunteer opportunity (Protected)
- **Headers**: `Authorization: Bearer {token}`
- **Body**: `{ nonprofitId, title, description, requiredSkills, location }`
- **Response**: Opportunity record
- **Status**: 201 Created

### GET /volunteering/opportunities
List volunteer opportunities
- **Query**: `?skills=teaching&remote=true&search=education`
- **Response**: Array of opportunities
- **Status**: 200 OK

### POST /volunteering/opportunities/:id/apply
Apply for opportunity (Protected)
- **Headers**: `Authorization: Bearer {token}`
- **Body**: `{ coverLetter, resume }`
- **Response**: Application record
- **Status**: 201 Created

### PATCH /volunteering/applications/:id/status
Update application status (Protected)
- **Headers**: `Authorization: Bearer {token}`
- **Body**: `{ status: APPROVED | REJECTED }`
- **Response**: Updated application
- **Status**: 200 OK

### POST /volunteering/hours
Log volunteer hours (Protected)
- **Headers**: `Authorization: Bearer {token}`
- **Body**: `{ applicationId, date, hours, description }`
- **Response**: Hours record
- **Status**: 201 Created

### POST /volunteering/certificate
Generate volunteer certificate (Protected)
- **Headers**: `Authorization: Bearer {token}`
- **Body**: `{ nonprofitId }`
- **Response**: Certificate record
- **Status**: 201 Created

### GET /volunteering/my-applications
Get my applications (Protected)
- **Headers**: `Authorization: Bearer {token}`
- **Response**: Array of applications
- **Status**: 200 OK

### GET /volunteering/my-hours
Get my volunteer hours (Protected)
- **Headers**: `Authorization: Bearer {token}`
- **Response**: `{ hours[], totalHours }`
- **Status**: 200 OK

---

## Events

### POST /events
Create event (Protected)
- **Headers**: `Authorization: Bearer {token}`
- **Body**: `{ nonprofitId, title, description, type, startDate, location }`
- **Response**: Created event
- **Status**: 201 Created

### GET /events
List all events
- **Query**: `?type=FUNDRAISER&upcoming=true&search=gala`
- **Response**: Array of events
- **Status**: 200 OK

### GET /events/:id
Get event details
- **Params**: Event ID
- **Response**: Event with tickets and registrations
- **Status**: 200 OK

### POST /events/:id/register
Register for event (Protected)
- **Headers**: `Authorization: Bearer {token}`
- **Body**: `{ ticketId?, attendeeInfo }`
- **Response**: Registration record
- **Status**: 201 Created

### POST /events/:id/check-in/:registrationId
Check in attendee (Protected)
- **Headers**: `Authorization: Bearer {token}`
- **Response**: Updated registration
- **Status**: 200 OK

### GET /events/my/registrations
Get my events (Protected)
- **Headers**: `Authorization: Bearer {token}`
- **Response**: Array of event registrations
- **Status**: 200 OK

### POST /events/:id/tickets
Add event tickets (Protected)
- **Headers**: `Authorization: Bearer {token}`
- **Body**: `{ tickets: [{ name, price, quantity }] }`
- **Response**: Created tickets
- **Status**: 201 Created

---

## Petitions

### POST /petitions
Create petition (Protected)
- **Headers**: `Authorization: Bearer {token}`
- **Body**: `{ title, description, category, targetSignatures, targetAudience }`
- **Response**: Created petition
- **Status**: 201 Created

### GET /petitions
List all petitions
- **Query**: `?category=ENVIRONMENT&search=climate`
- **Response**: Array of petitions
- **Status**: 200 OK

### GET /petitions/trending
Get trending petitions
- **Response**: Top 10 trending petitions
- **Status**: 200 OK

### GET /petitions/:id
Get petition details
- **Params**: Petition ID
- **Response**: Petition with signatures and updates
- **Status**: 200 OK

### POST /petitions/:id/sign
Sign petition (Protected)
- **Headers**: `Authorization: Bearer {token}`
- **Body**: `{ comment?, anonymous? }`
- **Response**: Signature record
- **Status**: 201 Created

### POST /petitions/:id/updates
Add petition update (Protected, Creator only)
- **Headers**: `Authorization: Bearer {token}`
- **Body**: `{ title, content }`
- **Response**: Update record
- **Status**: 201 Created

---

## Impact Tracking

### POST /impact/metrics
Create impact metric (Protected)
- **Headers**: `Authorization: Bearer {token}`
- **Body**: `{ nonprofitId, category, value, unit, description }`
- **Response**: Metric record
- **Status**: 201 Created

### POST /impact/stories
Create impact story (Protected)
- **Headers**: `Authorization: Bearer {token}`
- **Body**: `{ nonprofitId, title, content, category, images }`
- **Response**: Story record
- **Status**: 201 Created

### GET /impact/stories
List impact stories
- **Query**: `?category=EDUCATION`
- **Response**: Array of stories
- **Status**: 200 OK

### GET /impact/nonprofit/:id
Get nonprofit impact data
- **Params**: Nonprofit ID
- **Response**: `{ metrics, stories, financials }`
- **Status**: 200 OK

### POST /impact/financial-reports
Create financial report (Protected)
- **Headers**: `Authorization: Bearer {token}`
- **Body**: `{ nonprofitId, year, totalRevenue, programExpenses, document }`
- **Response**: Report record
- **Status**: 201 Created

---

## Forums

### POST /forums
Create forum (Protected)
- **Headers**: `Authorization: Bearer {token}`
- **Body**: `{ name, description, category }`
- **Response**: Created forum
- **Status**: 201 Created

### GET /forums
List all forums
- **Response**: Array of forums
- **Status**: 200 OK

### POST /forums/:forumId/threads
Create thread (Protected)
- **Headers**: `Authorization: Bearer {token}`
- **Body**: `{ title, content, tags }`
- **Response**: Created thread
- **Status**: 201 Created

### GET /forums/:forumId/threads
Get forum threads
- **Query**: `?search=volunteer&sort=popular`
- **Response**: Array of threads
- **Status**: 200 OK

### GET /forums/threads/:id
Get thread details
- **Params**: Thread ID
- **Response**: Thread with posts and comments
- **Status**: 200 OK

### POST /forums/threads/:threadId/posts
Create post (Protected)
- **Headers**: `Authorization: Bearer {token}`
- **Body**: `{ content }`
- **Response**: Created post
- **Status**: 201 Created

### POST /forums/posts/:postId/comments
Create comment (Protected)
- **Headers**: `Authorization: Bearer {token}`
- **Body**: `{ content }`
- **Response**: Created comment
- **Status**: 201 Created

---

## Communications

### POST /communications/email
Send email (Protected)
- **Headers**: `Authorization: Bearer {token}`
- **Body**: `{ to, subject, text, html }`
- **Response**: `{ success: true }`
- **Status**: 200 OK

### POST /communications/sms
Send SMS (Protected)
- **Headers**: `Authorization: Bearer {token}`
- **Body**: `{ to, message }`
- **Response**: `{ success: true }`
- **Status**: 200 OK

### POST /communications/campaigns
Create email campaign (Protected)
- **Headers**: `Authorization: Bearer {token}`
- **Body**: `{ nonprofitId, name, subject, content, recipients }`
- **Response**: Campaign record
- **Status**: 201 Created

### GET /communications/notifications
Get notifications (Protected)
- **Headers**: `Authorization: Bearer {token}`
- **Query**: `?unread=true`
- **Response**: Array of notifications
- **Status**: 200 OK

### PATCH /communications/notifications/:id/read
Mark notification as read (Protected)
- **Headers**: `Authorization: Bearer {token}`
- **Response**: Updated notification
- **Status**: 200 OK

### GET /communications/preferences
Get communication preferences (Protected)
- **Headers**: `Authorization: Bearer {token}`
- **Response**: Preferences object
- **Status**: 200 OK

### POST /communications/preferences
Update preferences (Protected)
- **Headers**: `Authorization: Bearer {token}`
- **Body**: `{ emailNotifications, smsNotifications, marketingEmails }`
- **Response**: Updated preferences
- **Status**: 200 OK

---

## Analytics

### GET /analytics/donor
Get donor analytics (Protected)
- **Headers**: `Authorization: Bearer {token}`
- **Response**: `{ totalDonated, totalDonations, nonprofitsSupported, recentDonations }`
- **Status**: 200 OK

### GET /analytics/campaign/:id
Get campaign analytics (Protected)
- **Headers**: `Authorization: Bearer {token}`
- **Response**: `{ totalRaised, goalPercentage, totalDonors, donationsByDay }`
- **Status**: 200 OK

### GET /analytics/nonprofit/:id
Get nonprofit analytics (Protected)
- **Headers**: `Authorization: Bearer {token}`
- **Response**: `{ totalDonations, activeCampaigns, volunteerHours, monthlyDonations }`
- **Status**: 200 OK

### GET /analytics/platform
Get platform stats (Public)
- **Response**: Platform-wide statistics
- **Status**: 200 OK

---

## Admin

### GET /admin/users
Get all users (Admin only)
- **Headers**: `Authorization: Bearer {token}`
- **Query**: `?role=DONOR&search=john`
- **Response**: Array of users
- **Status**: 200 OK

### PATCH /admin/users/:id/role
Update user role (Admin only)
- **Headers**: `Authorization: Bearer {token}`
- **Body**: `{ role: SUPER_ADMIN | NONPROFIT_ADMIN | DONOR | VOLUNTEER }`
- **Response**: Updated user
- **Status**: 200 OK

### GET /admin/verifications/pending
Get pending verifications (Admin only)
- **Headers**: `Authorization: Bearer {token}`
- **Response**: Array of nonprofits pending verification
- **Status**: 200 OK

### PATCH /admin/nonprofits/:id/verify
Verify nonprofit (Admin only)
- **Headers**: `Authorization: Bearer {token}`
- **Body**: `{ verified: true }`
- **Response**: Updated nonprofit
- **Status**: 200 OK

### GET /admin/stats
Get admin platform stats (Admin only)
- **Headers**: `Authorization: Bearer {token}`
- **Response**: Comprehensive platform statistics
- **Status**: 200 OK

### POST /admin/moderate
Moderate content (Admin only)
- **Headers**: `Authorization: Bearer {token}`
- **Body**: `{ contentType, contentId, action }`
- **Response**: Moderated content
- **Status**: 200 OK

---

## Status Codes

- **200 OK**: Success
- **201 Created**: Resource created
- **400 Bad Request**: Invalid request
- **401 Unauthorized**: Missing/invalid token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server error

## Rate Limiting

- Default: 100 requests per minute per IP
- Authenticated: 1000 requests per minute per user
- Configurable via environment variables

## Swagger Documentation

Interactive API docs available at: `http://localhost:4000/api`
