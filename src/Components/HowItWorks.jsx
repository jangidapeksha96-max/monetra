import "../styles/HowItWorks.css";

function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Add Subscriptions",
      text: "Add all your active subscriptions.",
      color: "green",
    },
    {
      number: "02",
      title: "Get Reminded",
      text: "Receive timely reminders before renewals.",
      color: "blue",
    },
    {
      number: "03",
      title: "Track & Analyze",
      text: "Track spending and understand your habits.",
      color: "peach",
    },
    {
      number: "04",
      title: "Save Smarter",
      text: "Avoid unnecessary fees and save money.",
      color: "brown",
    },
  ];

  return (
    <section
      className="how-it-works"
      id="how-it-works"
    >

      <div className="how-container">

        <div className="section-heading">

          <span className="section-label">
            HOW IT WORKS
          </span>

          <h2>
            Simple. Clear.
            <span> In Control.</span>
          </h2>

          <p>
            Monetra makes subscription management
            simple in just four steps.
          </p>

        </div>


        <div className="timeline">

          {steps.map((step, index) => (

            <div
              className="timeline-item"
              key={step.number}
            >

              <div
                className={`timeline-step ${step.color}`}
              >
                {step.number}
              </div>

              {index < steps.length - 1 && (
                <div className="timeline-line"></div>
              )}

              <h3>
                {step.title}
              </h3>

              <p>
                {step.text}
              </p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default HowItWorks;