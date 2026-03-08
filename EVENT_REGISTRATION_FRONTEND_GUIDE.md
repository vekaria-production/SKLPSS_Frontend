# Frontend Integration Guide: Event Registration & Ticketing

This document details how to implement the Event Registration and QR Code Check-in flow on the frontend. The backend provides two main endpoints to handle this functionality.

---

## 1. Register for an Event

When a user (member or non-member) wants to register for an event, the frontend should collect their phone number and the event ID, then submit it to this endpoint.

**Endpoint:** `POST /register_event/{event_id}`

### Request Parameters

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `event_id` | `integer` | **Yes** | Passed as a path parameter (URL). The ID of the event. |
| `phone_number` | `string` | **Yes** | Passed as a query parameter or form data (depending on exact OpenAPI spec/calling convention - check `/docs`). |
| `member_id` | `integer` | No | Passed as a query parameter. Pass this if the user is a logged-in registered member. |

### Success Response (200 OK)

If successful, the backend will return a unique `qr_token`. **The frontend must generate and display a QR Code image using this `qr_token` string.**

```json
{
  "message": "Registration successful",
  "qr_token": "a1b2c3d4-e5f6-7890-abcd-ef1234567890" 
}
```

*Frontend Action:* Use a library like `qrcode.react` (if using React) or similar to turn the `qr_token` string into a visual QR code for the user to screenshot or save.

### Error Responses

*   **400 Bad Request:** `{"detail": "Already registered for this event"}`
    *Frontend Action:* Display an error message to the user that this phone number is already registered for this specific event.
*   **404 Not Found:** If the `event_id` doesn't exist.

---

## 2. Verify QR Code (Event Check-In)

This endpoint is used by event organizers/admins at the door. The frontend app for admins should include a QR Code scanner (using the device camera). When the scanner reads the QR code, it will extract the `qr_token` string and securely call this endpoint.

**Endpoint:** `GET /verify_qr/{token}`

### Request Parameters

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `token` | `string` | **Yes** | Passed as a path parameter. This is the scanned string from the user's QR code. |

### Success Responses (200 OK)

The backend will check if the QR code is valid and whether the user has already been checked in.

**Scenario A: Clean Check-In (Access Granted)**
The backend successfully validates the ticket and automatically marks the user as `checked_in = True` in the database.

```json
{
  "status": "Access Granted",
  "phone_number": "1234567890"
}
```
*Frontend Action:* Show a green success screen allowing the guest in.

**Scenario B: Duplicate Ticket (Already Checked In)**
The QR code is valid, but this exact ticket was already scanned earlier.

```json
{
  "status": "Already Checked In",
  "phone_number": "1234567890"
}
```
*Frontend Action:* Show a warning/red screen to the admin that this ticket has already been used.

### Error Responses

*   **404 Not Found:** `{"detail": "Invalid QR code"}`
    *Frontend Action:* Show an error screen. The QR code does not belong to this system or has been tampered with.

---

## 3. Retrieve Event Registrations List

This endpoint allows the admin dashboard or event organizers to fetch the complete list of users registered for a specific event.

**Endpoint:** `GET /event_registrations/{event_id}`

### Request Parameters

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `event_id` | `integer` | **Yes** | Passed as a path parameter. The ID of the event. |

### Success Response (200 OK)

Returns the total count of registrations and an array containing details of each registration (including whether they have checked in).

```json
{
  "total_registrations": 2,
  "registrations": [
    {
      "registration_id": 1,
      "phone_number": "555-0199",
      "member_id": null,
      "is_member": false,
      "checked_in": false,
      "registered_at": "2026-03-07T23:30:00.123456"
    },
    {
      "registration_id": 2,
      "phone_number": "555-0250",
      "member_id": 14,
      "is_member": true,
      "checked_in": true,
      "registered_at": "2026-03-08T01:15:00.123456"
    }
  ]
}
```

*Frontend Action:* Use this list to display a searchable or paginated data table showing the guest list and real-time check-in status.

---

## Example Flow Summary
1. **User Portal:** User selects Event 5 -> Enters Phone `555-0199` -> Submits `POST /register_event/5?phone_number=555-0199`.
2. **User Portal:** Receives `qr_token: "xyz123"`. Renders QR Code graphic of `"xyz123"`.
3. **Admin Portal (At Door):** Scans the QR Code -> Extracts `"xyz123"`.
4. **Admin Portal:** Calls `GET /verify_qr/xyz123`.
5. **Admin Portal:** Gets `"Access Granted"`. Lets the user inside.
6. **Admin Dashboard:** Calls `GET /event_registrations/5` to see all registrations and live check-in progress.
