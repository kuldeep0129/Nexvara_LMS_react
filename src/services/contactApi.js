

const ENDPOINT =
  import.meta.env.VITE_CONTACT_ENDPOINT ||
  'https://localhost:7081/api/WebstiteUI/CreateEnquiry';

/**
 * Submits the Contact page enquiry to the ASP.NET Core API.
 */
export async function submitContact(payload) {
  // Convert Contact form fields to the backend request DTO.
  const requestBody = {
    name: payload.name?.trim() || '',
    email: payload.email?.trim() || '',
    phone: (payload.phone || '').replace(/[\s-]/g, ''),
    qualification: payload.qual || '',
    program: payload.program || '',
    callingTime: mapCallingTime(payload.time),
    message: payload.msg?.trim() || '',
  };

  let response;

  try {
    response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
  } catch {
    throw new Error(
      'Cannot connect to the server. Check that your ASP.NET Core API is running and CORS is configured.'
    );
  }

  // Read response safely; some APIs return an empty body.
  const contentType = response.headers.get('content-type') || '';
  let data = {};

  if (contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch {
      data = {};
    }
  } else {
    const text = await response.text().catch(() => '');
    if (text) data = { message: text };
  }

  if (!response.ok || data?.success === false) {
    const validationErrors = data?.errors
      ? Object.values(data.errors).flat().find(
          (message) => typeof message === 'string'
        )
      : null;

    throw new Error(
      validationErrors ||
        data?.message ||
        data?.title ||
        `Enquiry submission failed (HTTP ${response.status}).`
    );
  }

  return {
    ok: true,
    demo: false,
    ref:
      data?.ref ||
      data?.referenceNumber ||
      data?.id ||
      data?.data?.id ||
      `ENQ-${Date.now().toString().slice(-6)}`,
    ...data,
  };
}

/**
 * Maps UI labels to API calling-time values.
 * Change these values if your backend DTO uses different enum/string values.
 */
function mapCallingTime(time) {
  const values = {
    'Any time': 'anytime',
    'Morning (10 am to 1 pm)': 'morning',
    'Afternoon (1 pm to 4 pm)': 'afternoon',
    'Evening (4 pm to 6 pm)': 'evening',
  };

  return values[time] || 'anytime';
}
