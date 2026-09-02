import "../styles/Features.css";

function Features() {
  const features = [
    {
      number: "01",
      title: "Renewal Reminders",
      text: "Never miss a payment with timely reminders before your subscriptions renew.",
      color: "green",
    },
    {
      number: "02",
      title: "Expense Analytics",
      text: "Visualize your spending and understand where your subscription money goes.",
      color: "blue",
    },
    {
      number: "03",
      title: "Secure & Private",
      text: "Keep your subscription information organized with a secure experience.",
      color: "peach",
    },
    {
      number: "04",
      title: "All In One Place",
      text: "Track all your subscriptions from one simple and convenient dashboard.",
      color: "brown",
    },
  ];

  return (
    <section
      className="features"
      id="features"
    >

      <div className="section-container">

        <div className="section-heading">

          <span className="section-label">
            WHY MONETRA
          </span>

          <h2>
            Everything You Need to
            <span> Stay in Control</span>
          </h2>

          <p>
            One simple place to understand,
            manage and optimize every subscription.
          </p>

        </div>


        <div className="feature-grid">

          {features.map((feature) => (

            <article
              className="feature-card"
              key={feature.number}
            >

              <div
                className={`feature-number ${feature.color}`}
              >
                {feature.number}
              </div>

              <div
                className={`feature-icon-circle ${feature.color}`}
              >
                {feature.number === "01" && "↗"}
                {feature.number === "02" && "◔"}
                {feature.number === "03" && "✓"}
                {feature.number === "04" && "▣"}
              </div>

              <h3>
                {feature.title}
              </h3>

              <p>
                {feature.text}
              </p>

            </article>

          ))}

        </div>

      </div>

    </section>
  );
}

export default Features;