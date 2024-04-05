import * as React from "react";
import EmailTemplate from "./EmailTemplate";
import { Img } from "@react-email/components";

interface NewOrderProps {
  order: {
    nano_id: string;
    governorate: string;
    city: string;
    created_at: string;
    shipping_price: number;
    store_name: string;
    street: string;
    customer_name: string;
    apartment: string;
    phone_number: string;
    total: number;
  };
  items: {
    color: string;
    image_url: string;
    discount: number;
    name: string;
    price: number;
    quantity: number;
    size: string;
  }[];
}

export const NewOrder: React.FC<Readonly<NewOrderProps>> = ({
  order,
  items,
}) => (
  <EmailTemplate>
    <p
      style={{
        margin: 0,
        color: "#475467",
        maxWidth: "32rem",
      }}
    >
      Hi {order.customer_name},
      <br />
      <br />
      Your order from {order.store_name} has been placed successfully. Here are
      the details, you can always check the status of your order by visiting{" "}
      <a
        style={{
          color: "#E04F16",
          textDecoration: "none",
        }}
        href={`https://atlascustomer.vercel.app/order/${order.nano_id}`}
      >
        this link
      </a>
      .
    </p>
    <p
      style={{
        margin: "1.25rem 0 0.625rem 0",
        color: "#101828",
        fontWeight: 500,
      }}
    >
      Order Address:
    </p>
    <div
      style={{
        display: "flex",
        maxWidth: "32rem",
        marginBottom: "1.25rem",
      }}
    >
      <div
        style={{
          width: "50%",
        }}
      >
        <div
          style={{
            marginBottom: "1rem",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#344054",
              marginBottom: "0.125rem",
            }}
          >
            Name
          </p>
          <p
            style={{
              margin: 0,
              color: "#101828",
            }}
          >
            {order.customer_name}
          </p>
        </div>
        <div
          style={{
            marginBottom: "1rem",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#344054",
              marginBottom: "0.125rem",
            }}
          >
            Apartment
          </p>
          <p
            style={{
              margin: 0,
              color: "#101828",
            }}
          >
            {order.apartment}
          </p>
        </div>
        <div>
          <p
            style={{
              margin: 0,
              color: "#344054",
              marginBottom: "0.125rem",
            }}
          >
            Governorate
          </p>
          <p
            style={{
              margin: 0,
              color: "#101828",
            }}
          >
            {order.governorate}
          </p>
        </div>
      </div>
      <div
        style={{
          width: "50%",
        }}
      >
        <div
          style={{
            marginBottom: "1rem",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#344054",
              marginBottom: "0.125rem",
            }}
          >
            Street Name
          </p>
          <p
            style={{
              margin: 0,
              color: "#101828",
            }}
          >
            {order.street}
          </p>
        </div>
        <div
          style={{
            marginBottom: "1rem",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#344054",
              marginBottom: "0.125rem",
            }}
          >
            City
          </p>
          <p
            style={{
              margin: 0,
              color: "#101828",
            }}
          >
            {order.city}
          </p>
        </div>
        <div>
          <p
            style={{
              margin: 0,
              color: "#344054",
              marginBottom: "0.125rem",
            }}
          >
            Phone Number
          </p>
          <p
            style={{
              margin: 0,
              color: "#101828",
            }}
          >
            {order.phone_number}
          </p>
        </div>
      </div>
    </div>
    <p
      style={{
        margin: "0 0 0.625rem 0",
        color: "#101828",
        fontWeight: 500,
      }}
    >
      Order Details:
    </p>
    <div
      style={{
        display: "flex",
        maxWidth: "32rem",
        marginBottom: "1.25rem",
      }}
    >
      <div
        style={{
          width: "50%",
        }}
      >
        <div
          style={{
            marginBottom: "1rem",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#344054",
              marginBottom: "0.125rem",
            }}
          >
            Order ID
          </p>
          <p
            style={{
              margin: 0,
              color: "#101828",
            }}
          >
            {order.nano_id}
          </p>
        </div>
        <div
          style={{
            marginBottom: "1rem",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#344054",
              marginBottom: "0.125rem",
            }}
          >
            Shipping price
          </p>
          <p
            style={{
              margin: 0,
              color: "#101828",
            }}
          >
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "EGP",
              currencyDisplay: "symbol",
            }).format(order.shipping_price)}
          </p>
        </div>
        <div>
          <p
            style={{
              margin: 0,
              color: "#344054",
              marginBottom: "0.125rem",
            }}
          >
            Status
          </p>
          <p
            style={{
              margin: 0,
              color: "#101828",
            }}
          >
            Pending
          </p>
        </div>
      </div>
      <div
        style={{
          width: "50%",
        }}
      >
        <div
          style={{
            marginBottom: "1rem",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#344054",
              marginBottom: "0.125rem",
            }}
          >
            Subtotal
          </p>
          <p
            style={{
              margin: 0,
              color: "#101828",
            }}
          >
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "EGP",
              currencyDisplay: "symbol",
            }).format(order.total)}
          </p>
        </div>
        <div
          style={{
            marginBottom: "1rem",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#344054",
              marginBottom: "0.125rem",
            }}
          >
            Created at
          </p>
          <p
            style={{
              margin: 0,
              color: "#101828",
            }}
          >
            {new Intl.DateTimeFormat("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            }).format(new Date(order.created_at))}
          </p>
        </div>
      </div>
    </div>
    <div>
      <div
        style={{
          maxWidth: "32rem",
        }}
      >
        <p
          style={{
            margin: "0 0 0.625rem 0",
            color: "#101828",
            fontWeight: 500,
          }}
        >
          Order Items:
        </p>
        {items.map((item) => (
          <div
            key={item.name}
            style={{
              display: "flex",
              marginBottom: "1rem",
              border: "1px solid #d0d5dd",
              padding: "1rem",
              borderRadius: "0.5rem",
            }}
          >
            {item.image_url ? (
              <Img
                alt={item.name}
                src={item.image_url}
                style={{
                  borderRadius: "0.25rem",
                  height: "5rem",
                  marginRight: "1rem",
                  width: "5rem",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  backgroundColor: "#f4f4f4",
                  borderRadius: "0.25rem",
                  height: "5rem",
                  marginRight: "1rem",
                  width: "5rem",
                }}
              />
            )}
            <div>
              <p
                style={{
                  margin: 0,
                  color: "#101828",
                  fontWeight: 500,
                  marginBottom: "0.25rem",
                }}
              >
                {item.name}
              </p>
              <p
                style={{
                  margin: 0,
                  color: "#344054",
                  marginBottom: "0.25rem",
                }}
              >
                {item.color} / {item.size}
              </p>
              <p
                style={{
                  margin: 0,
                  color: "#344054",
                }}
              >
                <span
                  style={{
                    color: "#182230",
                    fontWeight: 500,
                  }}
                >
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "EGP",
                    currencyDisplay: "symbol",
                  }).format(order.total)}
                </span>{" "}
                (1 x{" "}
                {item.discount ? (
                  <span
                    style={{
                      textDecoration: "line-through",
                    }}
                  >
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "EGP",
                      currencyDisplay: "symbol",
                    }).format(item.price)}
                  </span>
                ) : null}
                <span>
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "EGP",
                    currencyDisplay: "symbol",
                  }).format(item.price - (item.discount || 0))}
                </span>
                )
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </EmailTemplate>
);
